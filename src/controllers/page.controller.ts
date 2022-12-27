import {Request, Response} from "express";
import {property, validation_service} from "../services/validation.service";
import {Left, Right} from "monet";
import {CustomError, error_types} from "../utils/error.util";
import {page_repository} from "../repository/page.repository";

const {properties_exist_validation} = validation_service
const {create_page, get_page, create_page_tag, get_tag} = page_repository

const check_if_url_in_sites = (id: string, arr: Array<any>) : boolean => {
    const filter = arr.filter(val => val.id === id)
    return filter.length > 0
}


export const page_create = async (request: Request, response: Response) => {

    const local = response.locals
    const session = local.session.session
    const sites = session.user.parent.sites

    const {name, page_url, title, site_id, is_public} = request.body

    const required_properties: property[] = [
        {name: "name", type: "string", min_length: 2},
        {name: "page_url", type: "string", min_length: 4},
        {name: "title", type: "string"},
        {name: "is_public", type: "boolean"},
        {name: "site_id", type: "string", min_length: 10},
    ]

    let query = properties_exist_validation(request.body, required_properties).chain(data => {
        if (sites.length === 0)
            return Left(new CustomError("You can't create a page if you dont have any sites, please create a site and try again",
                error_types.no_sites))

        if (!check_if_url_in_sites(site_id, sites))
            return Left(new CustomError("You dont have access to that site",
                error_types.no_site_access))

        return Right(data)
    })

    if (query.isRight()) {
        const page_query = await create_page({
            name, url: page_url, title, site: site_id, public: is_public
        })

        query = query.chain(() => page_query)
    }

    if (query.isLeft()) {
        const error_information = query.left()
        return response.status(400).json({
            success: false,
            error: {
                type: error_information.name,
                message: error_information.message
            }
        })
    }

    return response.status(200).json({
        success: true,
        response: query.right()
    })
}

export const get_page_ = async (request: Request, response: Response) => {

    const {id} = request.params

    if (id == null || id == undefined || typeof id !== "string") {
        return response.status(401).json({
            success: false,
            error: {
                type: "Invalid type",
                message: "The provided Id is invalid"
            }
        })
    }

    const query = await get_page({
        where: {
            id
        },
        section_relation: true,
        site_relation: true
    })

    if (query.isLeft()) {
        const error_information = query.left()
        return response.status(400).json({
            success: false,
            error: {
                type: error_information.name,
                message: error_information.message
            }
        })
    }

    return response.status(200).json({
        success: true,
        response: query.right()
    })

}

export const create_page_tag_ = async (request: Request, response: Response) => {
    const local = response.locals
    const session = local.session.session
    const sites = session.user.parent.sites

    const required_properties: property[] = [
        {name: "name", type: "string", min_length: 2},
        {name: "site", type: "string", min_length: 10},
    ]

    const {name, site} = request.body

    let query = properties_exist_validation(request.body, required_properties)
        .chain(data => check_if_url_in_sites(site, sites)? Right(data) : Left(new CustomError("Unauthorized", error_types.no_site_access)))

    if (query.isRight()) {
        const tag_query = await create_page_tag({
            name,
            site
        })

        query = query.chain(() => tag_query)
    }

    if (query.isLeft()) {
        const error_information = query.left()
        return response.status(400).json({
            success: false,
            error: {
                type: error_information.name,
                message: error_information.message
            }
        })
    }

    return response.status(200).json({
        success: true,
        response: query.right()
    })

}

export const get_page_tag_ = async (request: Request, response: Response) => {

    const required_properties: property[] = [
        {name: "id", type: "string", min_length: 10},
    ]


    let query = properties_exist_validation(request.params, required_properties)
    const {id} = request.params
    if (query.isRight()) {
        const tag_query = await get_tag({
            where: {
                id,
            },
            page_relation: true
        })

        query = query.chain(() => tag_query)
    }

    if (query.isLeft()) {
        const error_information = query.left()
        return response.status(400).json({
            success: false,
            error: {
                type: error_information.name,
                message: error_information.message
            }
        })
    }

    return response.status(200).json({
        success: true,
        response: query.right()
    })
}

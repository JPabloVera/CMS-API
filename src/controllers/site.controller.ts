import {Request, Response} from "express";
import {property, validation_service} from "../services/validation.service";
import {site_repository} from "../repository/site.repository";

const {properties_exist_validation} = validation_service
const {create_site, get_site} = site_repository

export const create = async (request: Request, response: Response) => {
    const local = response.locals
    const session = local.session.session

    const client_id = session.user.parent.id

    const {name, url, landing_page} = request.body

    const required_properties: property[] = [
        {name: "name", type: "string", min_length: 2},
        {name: "url", type: "string", min_length: 4},
        {name: "landing_page", type: "string"}
    ]

    let query = properties_exist_validation(request.body, required_properties)

    if (query.isRight()) {
        const site_query = await create_site({
            name, url, landing_page, owner: client_id
        })

        query = query.chain(() => site_query)
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

export const get = async (request: Request, response: Response) => {
    const {url} = request.params

    const query = await get_site({
        where: {
            url
        },
        page_tag_relation: true,
        pages_relation: true
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

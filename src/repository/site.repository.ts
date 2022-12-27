import {Client, Site, User} from "../models";
import {DBManager} from "../services/db_manager.service";
import {Either} from "monet";
import {ObjectLiteral} from "typeorm";
import {
    repository_create_response, repository_get_response,
    site_relations,
    site_select,
    site_where,
    user_select,
    user_where
} from "../types/repository.type";

type create_site_input = {
    name: string,
    url: string,
    owner: Client,
    landing_page: string,
}

type get_site_input = {
    where: site_where,
    page_tag_relation?: boolean,
    pages_relation?: boolean,
    owner_relations?: boolean
}

export const site_repository = {
    create_site: async (input: create_site_input) : repository_create_response => {
        const create = await DBManager.create({
            entity: Site,
            data: input
        })

        return create
    },
    get_site: async (input: get_site_input) : repository_get_response => {
        const query = await DBManager.select<site_where>({
            entity: Site,
            query: {
                where: input.where,
                relations: {
                    owner: input.owner_relations === true ? true : false,
                    pages: input.pages_relation === true ? true : false,
                    page_tags: input.page_tag_relation === true ? true : false
                }
            }
        })
        return query
    }
}

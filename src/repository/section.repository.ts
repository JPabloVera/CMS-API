import {Page, PageTag, Section,} from "../models";
import {DBManager} from "../services/db_manager.service";
import {
    page_tag_where,
    repository_create_response,
    repository_get_response,
    section_where
} from "../types/repository.type";
import {Either} from "monet";
import {ObjectLiteral} from "typeorm";

type create_site_input = {
    name: string,
    html_component: string,
    page: Page
}

type get_section_type = {
    where: section_where,
    page_relation?: boolean
}
const section_repository = {
    create_section: async (input: create_site_input) : repository_create_response  => {
        const create = await DBManager.create({
            entity: Section,
            data: input
        })
        return create
    },
    get_sections: async (input) : repository_get_response => {
        const query = await DBManager.select<section_where>({
            entity: Section,
            query: {
                where: input.where,
                relations: {
                    page: input.page_relation === true ? true : false
                }
            }
        })

        return query
    }
}

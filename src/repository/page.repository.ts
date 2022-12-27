import {Client, Page, PageTag, Site, User} from "../models";
import {DBManager} from "../services/db_manager.service";
import {
    page_tag_where,
    page_where,
    repository_create_response,
    repository_get_response,
    site_where
} from "../types/repository.type";
import {Either} from "monet";
import {ObjectLiteral} from "typeorm";

type create_page_input = {
    name: string,
    title: string,
    url: string,
    site: Site,
    public: boolean,
    tags?: PageTag[]
}

type create_page_tag_input = {
    name: string,
    site: Site,
    pages?: Page[]
}

type get_page_input = {
    where: page_where,
    tags_relation?: boolean
    section_relation?: boolean,
    site_relation?: boolean
}

type get_tag_input = {
    where: page_tag_where,
    page_relation?: boolean,
    site_relation?: boolean
}

export const page_repository = {
    create_page: async (input: create_page_input) : repository_create_response => {
        const create = await DBManager.create({
            entity: Page,
            data: input
        })

        return create
    },
    create_page_tag: async (input: create_page_tag_input) : repository_create_response=> {
        const create = await DBManager.create({
            entity: PageTag,
            data: input
        })
        return create
    },
    get_page: async (input: get_page_input) : repository_get_response => {
        const query = await DBManager.select<page_where>({
            entity: Page,
            query: {
                where: input.where,
                relations: {
                    tags: input.tags_relation === true ? true : false,
                    site: input.site_relation === true ? true : false,
                    sections: input.section_relation === true ? true : false
                }
            }
        })

        return query
    },
    get_tag: async (input: get_tag_input) : repository_get_response => {
        const query = await DBManager.select<page_tag_where>({
            entity: PageTag,
            query: {
                where: input.where,
                relations: {
                    site: input.site_relation === true ? true : false,
                    pages: input.page_relation === true ? true : false
                }
            }
        })

        return query
    }
}

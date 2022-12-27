import {IClient} from "./client.interface";
import {IPage} from "./page.interface";
import {IPageTag} from "./page_tag.interface";

export interface ISite {
    id: string,
    name: string,
    url: string,
    pages: IPage[]
    page_tags: IPageTag[]
    metadata?: JSON
    visitors: number
    owner: IClient
    created_at: Date
    updated_at: Date
    landing_page: string
}

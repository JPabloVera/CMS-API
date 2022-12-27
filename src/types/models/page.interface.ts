import {ISite} from "./site.interface";
import {ISection} from "./section.interface";
import {IPageTag} from "./page_tag.interface";

export interface IPage {
    id: string
    name: string
    title: string
    url: string
    tags: IPageTag[]
    site: ISite
    sections: ISection[]
    metadata?: JSON
    visitors: number
    public: Boolean
    created_at: Date
    updated_at: Date
}



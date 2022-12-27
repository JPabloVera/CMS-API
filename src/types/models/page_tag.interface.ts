import {IClient} from "./client.interface";
import {ISite} from "./site.interface";
import {IPage} from "./page.interface";
import {IUser} from "./user.interface";

export interface IPageTag {
    id: string
    name: string
    site: ISite
    pages: IPage[]
    created_at: Date
    updated_at: Date
}

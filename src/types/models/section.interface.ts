import {IPage} from "./page.interface";
import {IUser} from "./user.interface";

export interface ISection {
    id: string
    name: string
    html_content: string
    page: IPage
    metadata?: JSON
    created_at: Date
    updated_at: Date
}

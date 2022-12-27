import {IUser} from "./user.interface";
import {IPage} from "./page.interface";

export interface IComment {
    id: string
    content: string
    creator: IUser
    page: IPage
    parent?: IComment
    children: IComment[]
    likes?: number
    dislikes?: number
    metadata?: JSON
    created_at: Date
    updated_at: Date
}

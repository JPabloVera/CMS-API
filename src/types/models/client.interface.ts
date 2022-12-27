import {IUser} from "./user.interface";
import {ISite} from "./site.interface";

export interface IClient {
    id: string,
    name: string,
    nice_name: string
    active: boolean,
    type: ClientTypes,
    users: IUser[],
    sites: ISite[]
    created_at: Date,
    updated_at: Date
}

export type ClientTypes = "Administrator" | "Regular"

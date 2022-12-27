import {IClient} from "./client.interface";
import {IRole} from "./roles.interface";
import {ISite} from "./site.interface";

export interface IUser {
    id: string,
    parent: IClient,
    status: UserStatus,
    first_name: string,
    last_name: string,
    email: string,
    password: string
    location?: JSON
    metadata?: JSON
    created_at: Date
    updated_at: Date
}


export type UserStatus = "active" | "inactive"

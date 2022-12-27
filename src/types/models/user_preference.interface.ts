import {IUser} from "./user.interface";
import {IClient} from "./client.interface";
import {IRole} from "./roles.interface";

export interface IUserPreference {
    id: string
    name?: string
    user: IUser
    client: IClient
    fonts?: JSON
    colors: JSON
    media?: JSON
    metadata?: JSON
    roles: IRole[]
    created_at: Date
    updated_at: Date
}

import {IClient} from "./client.interface";
import {IUser} from "./user.interface";
import {ISite} from "./site.interface";
import {IUserPreference} from "./user_preference.interface";

export interface IRole {
    id: string,
    name: string,
    owner: IClient,
    users: IUser[]
    site: ISite
    permissions: BasePermission[]
    preferences: IUserPreference[]
    created_by: IUser
    created_at: Date,
    updated_at: Date
}

export enum BasePermission {
    c_content = "create_content",
    u_content = "update_content",
    d_content = "delete_content",
    c_user = "create_user",
    u_user = "update_user",
    d_user = "delete_user",
    u_client = "update_client",
    c_role = "create_role",
    u_role = "update_role",
    d_role = "delete_role"
}

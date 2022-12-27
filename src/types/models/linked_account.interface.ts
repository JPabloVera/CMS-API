import {IUser} from "./user.interface";
import {ISite} from "./site.interface";

export interface ILinkedAccount {
    id: string
    user: IUser
    type: ILinkedAccountType
    status: LinkedAccountStatus
    metadata?: JSON
    created_at: Date
    updated_at: Date
}

export enum LinkedAccountStatus {
    enabled= "ENABLED",
    disabled="DISABLED"
}

export interface ILinkedAccountType {
    id: string
    name: string
    source: string
    site: ISite
    created_at: Date
    updated_at: Date
    accounts: ILinkedAccount[]
}

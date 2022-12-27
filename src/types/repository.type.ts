import {Entity} from "./util.interface";
import {ClientTypes} from "./models/client.interface";
import {UserStatus} from "./models/user.interface";
import {Either} from "monet";
import {ObjectLiteral} from "typeorm";
import {CustomError} from "../utils/error.util";

type select_query_type<W,S,R> = {
    where?: W,
    select?: S,
    relations?: R
}

export type select_input_type<W,S,R> = {
    entity: Entity,
    query: select_query_type<W, S, R>
}

export type client_where = {
    id?: string,
    name?: string,
    nice_name?: string,
    active?: boolean,
    type?: ClientTypes
}

export type client_select = {
    name?: boolean,
    nice_name?: boolean,
    active?: boolean,
    type?: boolean,
    created_at?: boolean,
    updated_at?: boolean
}

export type client_relations = {
    users: boolean,
    sites: boolean
}

export type client_update_query = {
    where: {
        id?: string,
        name?: boolean,
        nice_name?: boolean,
    },
    data: {
        name?: string,
        nice_name?: string,
        active?: boolean,
        type?: ClientTypes
    }
}

export type update_query_type<T> = {
    entity: Entity,
    query: T
}

export type create_input_type<T> = {
    entity: Entity
    data?: T,
}

export type user_select = {
    id?: boolean,
    parent?: boolean,
    first_name?: boolean,
    last_name?: boolean,
    email?: boolean,
    status?: boolean,
    location?: boolean,
    metadata?: boolean,
    created_at?: boolean,
    updated_at?: boolean
}

export type user_where = {
    id?: string,
    parent?: string,
    first_name?: string,
    last_name?: string,
    email?: string,
    status?: UserStatus
}

export type site_where = {
    id?: string,
    name?: string,
    url?: string,
    landing_page?: string
}

export type site_select = {
    id?: boolean,
    name?: boolean,
    url?: boolean,
    landing_page?: boolean,
    metadata?: boolean,
    created_at?: boolean,
    updated_at?: boolean,
    owner?: boolean
}

export type site_relations = {
    client?: boolean
    page?: boolean,
    page_tags?: boolean
}

export type page_where = {
    id?: string,
    name?: string,
    title?: string,
    url?: string,
    public?: boolean
}

export type page_tag_where = {
    id?: string,
    name?: string,
    site?: string
}

export type section_where = {
    id?: string,
    name?: string,
    page?: string
}

export type repository_create_response = Promise<Either<any, ObjectLiteral>>
export type repository_get_response = Promise<Either<any, ObjectLiteral[]>>

import {ClientTypes} from "../types/models/client.interface";
import {Either, Left, Right} from "monet";
import {DBManager} from "../services/db_manager.service";
import {Client} from "../models";
import {user_repository} from "./user.repository";
import {
    client_relations,
    client_select,
    client_where,
    repository_create_response,
    repository_get_response
} from "../types/repository.type";
import {ObjectLiteral} from "typeorm";


type create_client_and_user_input = {
    name: string,
    nice_name: string,
    type: ClientTypes,
    active?: true,
    first_name: string,
    last_name: string,
    email: string,
    password: string
}

type client_create_type = {
    name: string,
    nice_name: string,
    active?: boolean
}

type get_client_input = {
    where: client_where,
    user_relations?: boolean,
    site_relations?: boolean
}

export const client_repository = {
    create_client_with_main_user: async (input: create_client_and_user_input) : repository_create_response => {
        const create = await DBManager.create<client_create_type>({
            entity: Client,
            data: {
                name: input.name,
                nice_name: input.nice_name,
                active: input.active
            }
        })

        if (create.isLeft()) return create

        const create_response = create.right()

        const create_user = await user_repository.create_user({
            parent_id: create_response.id,
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            password: input.password
        })


        if (create_user.isLeft()) return create_user

        const response = create.chain(data => {
            data.users = [create_user.right()]
            return Right(data)
        })

        return response
    },
    get_client: async (input: get_client_input) : repository_get_response => {


        const query = await DBManager.select<client_where, client_select, client_relations>({
            entity: Client,
            query: {
                where: input.where,
                relations: {
                    users: input.user_relations === true ? true : false,
                    sites: input.site_relations === true ? true : false
                }
            }
        })

        return query
    }
}

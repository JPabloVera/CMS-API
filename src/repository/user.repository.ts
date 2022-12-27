import {DBManager} from "../services/db_manager.service";
import {User} from "../models";
import {repository_create_response, repository_get_response, user_select, user_where} from "../types/repository.type";
import {Either, Left} from "monet";
import {ObjectLiteral} from "typeorm";
import {hash_service} from "../services/hash.service";


type create_user_input = {
    parent_id: string,
    first_name: string,
    last_name: string,
    email: string,
    location?: {
        country: "argentina"
    },
    password: string
}

type user_create_type = {
    parent: string,
    first_name: string,
    last_name: string,
    email: string,
    location?: object,
    password: string
}

type get_user_input = {
    where: user_where,
    parent_relationship?: boolean | {
        sites: boolean | {
            pages: true
        }
    }

}

const {hash_text} = hash_service

export const user_repository = {
    create_user: async (input: create_user_input) : repository_create_response => {
        const hashed_password = hash_text(input.password)
        if (hashed_password.isLeft()) return new Promise(() => hashed_password)

        const user_create = await DBManager.create<user_create_type>({
            entity: User,
            data: {
                parent: input.parent_id,
                first_name: input.first_name,
                last_name: input.last_name,
                email: input.email,
                location: input.location,
                password: hashed_password.right()
            }
        })
        return user_create
    },
    get_user: async (input: get_user_input) : repository_get_response => {
        const query = await DBManager.select<user_where, user_select>({
            entity: User,
            query: {
                where: input.where,
                relations: {
                    parent: input.parent_relationship ? input.parent_relationship : false,
                }
            }
        })

        return query
    }
}

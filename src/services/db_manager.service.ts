import {ObjectLiteral} from "typeorm";
import {Either} from "monet";
import {create_query_c, select_query_c, update_query_c} from "../utils/db.util";
import {try_async} from "../utils/index.utils";
import {CustomError, error_types} from "../utils/error.util";
import {create_input_type, select_input_type, update_query_type} from "../types/repository.type";


export class DBManager {

    static async create<T>(input: create_input_type<T>) : Promise<Either<Error, ObjectLiteral>> {
        const try_query = await try_async<ObjectLiteral>(async () => {
            const query_fn = await create_query_c(input.entity)
            const query_response = await query_fn(input.data)
            return query_response
        })
        return try_query
    }

    static async select<W,S=any,R=any>(input: select_input_type<W, S, R>): Promise<Either<Error, ObjectLiteral[]>> {
        const try_query = await try_async<ObjectLiteral[]>(async () => {

            const query_fn = await select_query_c(input.entity)
            const query_response = await query_fn(input.query)

            if (query_response.length === 0) {
                throw new CustomError("No element has been found with the given id", error_types.not_found, {
                    input: JSON.stringify(input),
                    response: query_response
                })
            }

            return query_response
        })

        return try_query
    }

    static async update<T>(input: update_query_type<T> | any): Promise<Either<Error, boolean>>{
        const try_query = try_async<boolean>(async () => {
            const does_element_exist = await this.select({
                entity: input.entity,
                query: {
                    where: input.query.where
                }
            })

            if (does_element_exist.isLeft()) throw does_element_exist.left()

            if (does_element_exist.right().length > 1)
                throw new CustomError("The select query is to vague", error_types.vague_query, {
                    query: JSON.stringify(input.query)
                })

            const query_fn = await update_query_c(input.entity)
            const query_response = await query_fn({
                where: input.query.where,
                data: input.query.data
            })

            if (query_response.affected !== 1)
                throw new CustomError("There was an issue updating the element", error_types.update_error, {
                    input: JSON.stringify(input),
                    query_response: JSON.stringify(query_response)
                })

            return true
        })
        return try_query
    }

}

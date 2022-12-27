import {DataSource, ObjectLiteral, UpdateResult} from "typeorm";
import {AppDataSource} from "../config/db.config";
import {Entity, EntityRepository} from "../types/util.interface";
import {CustomError, error_types} from "./error.util";
import {try_sync, try_async} from "./index.utils";

const initialize_db_connection = async (ds: DataSource) : Promise<DataSource> => {
    try {
        if (!ds.isInitialized) await ds.initialize()

        return ds
    } catch (e: any) {
        throw new CustomError("There was an issue initializating the db", error_types.database_connection, {
            source: ds,
            error: e
        })
    }
}

const close_db_connection = async (ds = AppDataSource) : Promise<void> => {
    if (ds.isInitialized) await ds.destroy()
}


const get_repository = async (entity: Entity, ds: DataSource): Promise<EntityRepository> => {
    try {
        const data_source = await initialize_db_connection(ds)
        const repository = await ds.getRepository(entity)
        return repository
    } catch (e: any) {
        throw new CustomError("There was an issue initializating the repository", error_types.repository_initialization, {
            data_source: ds,
            entity,
            error: e
        })
    }
}

const create_query = <T>(repository: EntityRepository) => async (input: T | any) : Promise<ObjectLiteral> => {
    try {
        const created_element = repository.create(input)

        const save_element = await repository.save(created_element)

        return save_element

    } catch (e: any) {
        throw new CustomError(e['sqlMessage'], error_types.db_query, {
            type: "create",
            input: input,
            error: e['sqlMessage']
        })
    }
}

const select_query = <T>(repository: EntityRepository) =>  async (input: T | any): Promise<ObjectLiteral[]> => {
    try {
        const query = await repository.find({
            ...input
        })

        return query
    } catch (e: any) {
        console.log(e)
        throw new CustomError(e.message, error_types.db_query, {
            type: "select",
            error: e
        })
    }
}

const update_query= (repository: EntityRepository) => async (input: {where: any, data: any}) : Promise<UpdateResult> => {
    try {
        const update = await repository.update(input.where, input.data)
        return update
    } catch (e: any) {
        throw new CustomError("There was an issue performing the 'UPDATE' database query", error_types.db_query, {
            type: "update",
            input: JSON.stringify(input),
            error: JSON.stringify(e)
        })
    }
}

export const select_query_c = async <T>(entity: Entity) : Promise<Function> => {
    const repository = await get_repository(entity, AppDataSource)
    const select_fn = select_query<T>(repository)
    return select_fn
}

export const create_query_c = async <T>(entity: Entity): Promise<Function> => {
    const repository = await get_repository(entity, AppDataSource)
    const create_fn = create_query(repository)
    return create_fn
}

export const update_query_c = async (entity: Entity): Promise<Function> => {
    const repository = await get_repository(entity, AppDataSource)
    const update_fn = update_query(repository)
    return update_fn
}

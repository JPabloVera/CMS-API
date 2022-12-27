import {Request, Response, NextFunction, response} from "express";
import {IBodyRequest} from "../types/index.interface";
import {Either, Left, Right} from "monet";

const async_error_wrapper = (controller: any) =>
    (req: Request, resp: Response, next: NextFunction) => {
        try {
            controller(req, resp, next)
        } catch (e: any) {
            response.status(500).json({
                status: "Application Failed",
                error: e
            })
        }
    }


const validate_request = (request_model : IBodyRequest, req: Request) : void => {

    const body = req.body
    const fields = request_model.fields

    fields.forEach(value => {
        if (body.hasOwnProperty(value.name)) {
            if (typeof body[value.name] !== value.type) {
                throw "Invalid argument"
            }
        } else {
            throw "Missing arguments"
        }
    })
}


const compose = <T>(...f_list: Function[]) => {
    return (x: T) => {
        f_list.forEach( fn => {
            x = fn(x)
        })
        return x
    }

}


const either_wrapper = <T>(fn: Function, params: any[]): Either<any, T> => {
    try {
        return Right(fn(...params))
    }catch (err: any) {
        return Left(err)
    }
}

const get_async_monad_response = async (data: Promise<any>) => {
    return data.then(response => {
        return response
    })
}
const is_promise = (p:any) => {
    if (typeof p === 'object' && typeof p.then === 'function') {
        return true;
    }
    return false;
}

const try_sync = <T>(f: Function, custom_error?: any) : Either<Error, T> => {
    try {
        const result = f()
        return Right(result)
    }catch (e: any) {
        if (custom_error) {
            const error = custom_error(e)
            return Left(error)
        }
        return Left(e)
    }
}

const try_async = async <T>(f: Function, custom_error?: any) : Promise<Either<Error, T>> =>{
    try {
        const result = await f()
        return Right(result)
    }catch (e: any) {
        if (custom_error) {
            const error = custom_error(e)
            return Left(error)
        }
        return Left(e)
    }
}

export {async_error_wrapper, validate_request, compose, either_wrapper, get_async_monad_response, try_sync, try_async}

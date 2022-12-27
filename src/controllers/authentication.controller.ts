import {Request, Response} from 'express';
import {property, validation_service} from "../services/validation.service";
import {client_repository} from "../repository/client.repository";
import {user_repository} from "../repository/user.repository";
import {Left, Right} from "monet";
import {CustomError, error_types, validation_error_type, ValidationError} from "../utils/error.util";
import {hash_service} from "../services/hash.service";
import {IPartialSession} from "../types/util.interface";
import {authenticate_service} from "../services/authentication.service";

const {properties_exist_validation} = validation_service
const {create_client_with_main_user} = client_repository
const {get_user} = user_repository
const {verify_hash} = hash_service
const {encode_session} = authenticate_service

const register = async (request: Request, response: Response) => {

    const required_properties: property[] = [
        {name: "name", type: "string", min_length: 4},
        {name: "nice_name", type: "string", min_length: 4},
        {name: "first_name", type: "string", min_length: 2},
        {name: "last_name", type: "string", min_length: 2},
        {name: "email", type: "string", min_length: 5},
        {name: "password", type: "string", min_length: 8}
    ]

    const {name, nice_name, first_name, last_name, email, password} = request.body

    const select_email = await get_user({
        where: {
            email
        }}
    )

    const validation = properties_exist_validation(request.body, required_properties).chain(data => {
        if (select_email.isRight()) {
            return Left(new ValidationError("Invalid request: email is already being used", validation_error_type.invalid_property))
        }
        return Right(data)
    })



    if (validation.isLeft()) {
        const error_information = validation.left()
        return response.status(400).json({
            success: false,
            error: {
                type: error_information.name,
                message: error_information.message
            }
        })
    }

    const query = await create_client_with_main_user({
        name, nice_name: nice_name !== undefined? nice_name : name,
        first_name, last_name, email, password, type: "Regular", active: true
    })

    if (query.isLeft()) {
        const error_information = query.left()
        return response.status(400).json({
            success: false,
            error: {
                type: error_information.name,
                message: error_information.message,
                error: error_information['data']['error']
            }
        })
    }

    return response.status(200).json({
        success: true,
        response: query.right()

    })

}

const login = async (request: Request, response: Response) => {
    const required_properties: property[] = [
        {name: "email", type: "string"},
        {name: "password", type: "string"}
    ]

    const {email, password} = request.body

    const user_query = await get_user({
        where: {
            email,
        },
        parent_relationship: {
            sites: {
                pages: true
            }
        }
    })

    const validation = properties_exist_validation(request.body, required_properties)
        .chain(() => user_query)
        .chain(data => {
            const response = data[0]
            if (response.status === "inactive")
                return Left(new CustomError("Authorization error: User is inactive", error_types.authorization_error))
            return verify_hash(password, response['password'], "Failed Verification: Invalid Password",data[0] )
        }).chain(data => {
            const session: IPartialSession = {
                user: {
                    id: data.id,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    parent: data.parent
                }
            }
            return encode_session(session)
        })

    if (validation.isLeft()) {
        const error_information = validation.left()
        return response.status(400).json({
            success: false,
            error: error_information.message,
        })
    }

    const response_ = validation.right()

    return response.status(200).json({
        success: true,
        token: response_.token,
        session: response_.session
    })


}

const test = (request: Request, response: Response) => {
    console.log(response.locals.session.user.parent)
    return response.status(200).json({
        success: true
    })
}
export {login, register, test}

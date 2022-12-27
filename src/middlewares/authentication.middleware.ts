import {Request, Response, NextFunction} from "express";
import {authenticate_service} from "../services/authentication.service";
import {ISession} from "../types/index.interface";

const {decode_session} = authenticate_service

const check_session_expiration = (session: ISession) : Boolean => {
    const now = Date.now()

    return session.expires > now
}

const get_token_from_header = (header: string) : string => header.split(' ')[1]

const authenticate = async (request: Request, response: Response, next: NextFunction) => {

    const unauthorized = (message="Failed to validate your authorization token") => response.status(401).json({
        success: false,
        message
    })
    try {

        const auth_header : string | undefined = request.headers['authorization']
        if (typeof auth_header === "string") {
            const auth_token : string = get_token_from_header(auth_header)
            const try_decoded_session = await decode_session(auth_token)

            if (try_decoded_session.isLeft()) return unauthorized()

            const decoded_session = try_decoded_session.right()

            if (decoded_session.type === "valid") {

                const session_expiration_status : Boolean = check_session_expiration(decoded_session.session)

                if (session_expiration_status) {
                    response.locals.session = decoded_session
                    return next()
                }
            }
        }

        return unauthorized()
    } catch (e: any) {
        //TODO logger
        console.log(e)
        return unauthorized()
    }
}

export {authenticate}

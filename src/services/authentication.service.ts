import {sign, verify} from 'jsonwebtoken'
import {IDecodeResult, IEncodeResult, IPartialSession, ISession} from "../types/index.interface";
import {try_async, try_sync} from "../utils/index.utils";
import {Either} from "monet";
import {CustomError, error_types} from "../utils/error.util";
import {user_repository} from "../repository/user.repository";

const TOKEN_SECRET: string = process.env.TOKEN_SECRET !== undefined ? process.env.TOKEN_SECRET : "token"


const authenticate_service = {
    encode_session: (partial_session: IPartialSession) : Either<Error, IEncodeResult> => {
        const try_sign = try_sync<IEncodeResult>(() => {
            const issued = Date.now();
            const fifteen_minutes_in_ms = 15 * 60 * 1000;
            const expires = issued + fifteen_minutes_in_ms;
            const session: ISession = {
                ...partial_session,
                issued: issued,
                expires: expires
            };


            return {
                token: sign(session, TOKEN_SECRET, {expiresIn: expires}),
                session: session,
                issued: issued,
                expires: expires
            };
        }, (e: any) => {
            return new CustomError("Could not sign in, please try again", error_types.sign_in_error, e)
        })
        return try_sign
    },
    decode_session: async (token: string) => {
        const try_decode = await try_async<IDecodeResult>(async () => {
            const decode_token: any = verify(token, TOKEN_SECRET)
            if (decode_token['user'] === undefined) {
                throw new CustomError("Invalid token", error_types.invalid_token)
            }

            const user_exist = await user_repository.get_user({
                where: {
                    id: decode_token['user']['id']
                }
            })

            if (user_exist.isLeft()) throw new CustomError("Invalid token", error_types.invalid_token)

            const decode_result: IDecodeResult = {
                type: "valid",
                session: {
                    user: decode_token['user'],
                    issued: decode_token['issued'],
                    expires: decode_token['expires']
                }
            }

            return decode_result

        }, (e: any) => {
            return new CustomError("Invalid token", error_types.invalid_token, e)
        })
        return try_decode
    }
}


export {authenticate_service}

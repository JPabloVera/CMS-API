import bcrypt from 'bcryptjs'
import {try_sync} from "../utils/index.utils";
import {Either} from "monet";
import {CustomError, error_types} from "../utils/error.util";

const salt_rounds = 10

export const hash_service = {
    hash_text: (text: string) : Either<Error, string> => {
        const try_hash =  try_sync<string>( () => {
            const hashed_text = bcrypt.hashSync(text, salt_rounds)

            return hashed_text
        })

        return try_hash
    },
    verify_hash: (text: string, hash: string, custom_error_message?: string, data?: any) : Either<Error, boolean | any> => {
        const verify =  try_sync<boolean>( () => {
            const hashed_text = bcrypt.compareSync(text,hash)
            const message = custom_error_message || "Failed Verification"
            if (hashed_text !== true)
                throw new CustomError(message,error_types.failed_hash_verification)

            if (data !== undefined) return data
            return true
        })

        return verify
    }
}

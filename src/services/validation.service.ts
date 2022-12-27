import {try_sync} from "../utils/index.utils";
import {validation_error_type, ValidationError} from "../utils/error.util";

export type property = {name: string, type: string, min_length?: number}
export const validation_service = {
    properties_exist_validation: (data: any, properties: property[]) => {
        const verify = try_sync<any>(() => {
            properties.forEach((property: property) => {
                if (!data.hasOwnProperty(property.name)) {
                    throw new ValidationError(`Invalid request: ${property.name} is missing`, validation_error_type.missing_property)
                }
                if (typeof data[property.name] !== property.type) {
                    throw new ValidationError(`Invalid request: ${property.name} is not of type ${property.type}`, validation_error_type.invalid_type)
                }
                if (property.min_length !== undefined){
                    if (data[property.name].length < property.min_length) {
                        throw new ValidationError(`Invalid request: ${property.name} needs to be at least ${property.min_length} characters long`, validation_error_type.invalid_property)
                    }

                }
            })
            return data
        })
        return verify
    }
}

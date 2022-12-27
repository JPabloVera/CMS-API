export enum error_types {
    database_connection = "DatabaseConnectionError",
    repository_initialization = "RepositoryInitializationError",
    db_query = "DatabaseQueryError",
    not_found = "ElementNotFoundError",
    vague_query = "QueryIsTooVagueError",
    update_error = "UpdateQueryError",
    failed_hash_verification = "FailedHashVerification",
    authorization_error = "AuthorizationError",
    sign_in_error="SigInError",
    invalid_token="Invalid Token",
    no_sites = "Null Sites",
    no_site_access= "NoAccessToSite"
}

export class CustomError extends Error {
    protected data: any
    constructor(message: string, error_name: error_types, data?: any) {
        super(message);
        this.name = error_name
        this.data = data
    }
}

export enum validation_error_type {
    missing_property= "Missing Property",
    invalid_type="Invalid type",
    invalid_property="Invalid Property"
}

export class ValidationError extends Error {
    protected data: any
    constructor(message: string, error_name: validation_error_type, data?: any) {
        super(message);
        this.name = error_name
        this.data = data
    }
}

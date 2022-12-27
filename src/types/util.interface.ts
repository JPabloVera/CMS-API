import {EntityTarget, ObjectLiteral, Repository} from "typeorm";
import {IClient} from "./models/client.interface";

export interface IBodyRequestField {
    name: string,
    type: string
}

export interface IBodyRequest {
    fields: Array<IBodyRequestField>
}

export interface ISession {
    user: {
        id: string,
        email: string,
        first_name: string,
        last_name: string,
        parent: IClient
    },
    issued: number
    expires: number
}

export type IPartialSession = Omit<ISession, "issued" | "expires">;

export interface IEncodeResult {
    token: string,
    session: ISession,
    expires: number,
    issued: number
}

export type IDecodeResult =
    | {
    type: "valid";
    session: ISession;
}
    | {
    type: "integrity-error";
}
    | {
    type: "invalid-token";
};

export interface update_element_input {
    id: string | any,
    body: any
}

export type IExpirationStatus = "expired" | "active" ;

export type Entity = EntityTarget<ObjectLiteral>
export type EntityRepository = Repository<ObjectLiteral>

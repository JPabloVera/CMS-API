import {IDecodeResult} from "../../src/types/index.interface";

const app = require("../../src/index")
const request = require("supertest")
import {decode_session} from "../../src/services/authentication.service";

describe("POST /login failure", () => {
    it("case: missing field, should return status code 500", async () => {
        const response = await request(app)
            .post("/login")

        expect(response.statusCode).toEqual(500)
    })

    it ("case: missing field, response should have the right format", async () => {

        const response = await request(app)
            .post("/login")

        expect(response.body["success"]).toEqual(false)
        expect(response.body["message"]).toEqual("Missing arguments")
    })

})

describe("POST /login success", () => {
    it("case: return code should be 200", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                api_id:"01230202"
            })
        expect(response.statusCode).toEqual(200)
    })

    it("case: response should have the right format", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                api_id:"01230202"
            })

        expect(response.body["success"]).toEqual(true)
        expect(response.body).toHaveProperty("session")
        expect(response.body["session"]).toHaveProperty("expires")
        expect(response.body["session"]).toHaveProperty("token")
        expect(response.body["session"]).toHaveProperty("issued")

        expect(isNaN(response.body["session"]["issued"])).toEqual(false)
        expect(isNaN(response.body["session"]["expires"])).toEqual(false)

        expect(typeof response.body["session"]["token"]).toEqual("string")
    })

    it("case: token should be valid", async () => {
        const api_id = "0123132"
        const response = await request(app)
            .post("/login")
            .send({
                api_id
            })

        const token: string = response.body["session"]["token"]
        const decode_token : IDecodeResult = decode_session(token)

        expect(decode_token.type).toEqual("valid")

        if (decode_token.type === "valid") {
            console.log(decode_token.session)
            expect(decode_token.session["id"]).toEqual(api_id)

            expect(isNaN(response.body["session"]["issued"])).toEqual(false)
            expect(isNaN(response.body["session"]["expires"])).toEqual(false)
        }
    })
})

describe("GET /is_authenticated failure",  () => {
    it ("case: invalid token, status code should be 401", async () => {
        const response = await request(app)
            .get("/is_authenticated")

        expect(response.statusCode).toEqual(401)
    })

    it ("case: invalid token, response should have the right format", async () => {
        const response = await request(app)
            .get("/is_authenticated")

        expect(response.body["success"]).toEqual(false)
        expect(response.body["message"]).toEqual("Failed to validate your authorization token.")
    })
})

describe("GET /is_authenticated success",  () => {
    it ("case: valid token, status code should be 200", async () => {
        const getting_token = await request(app)
            .post("/login")
            .send({
                api_id:"01230202"
            })

        const response = await request(app)
            .get("/is_authenticated")
            .auth(getting_token.body["session"]["token"], {type: "bearer"})

        expect(response.statusCode).toEqual(200)
    })

    it ("case: invalid token, response should have the right format", async () => {
        const getting_token = await request(app)
            .post("/login")
            .send({
                api_id:"01230202"
            })

        const response = await request(app)
            .get("/is_authenticated")
            .auth(getting_token.body["session"]["token"], {type: "bearer"})

        expect(response.body["success"]).toEqual(true)
        expect(response.body["message"]).toEqual("user authenticated")
    })
})

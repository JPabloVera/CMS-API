import {Express} from 'express'
import {login, register, test} from "../controllers/authentication.controller";

const routes = (app:Express) => {
    app.post('/login' , login)

    app.post('/register', register)
}

export default routes

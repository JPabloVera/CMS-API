import {Express} from 'express'
import {create, get} from "../controllers/site.controller";
import {authenticate} from "../middlewares/authentication.middleware";

const routes = (app:Express) => {
    app.post('/site/create',authenticate,create)

    app.get('/site/:url', get)
}

export default routes

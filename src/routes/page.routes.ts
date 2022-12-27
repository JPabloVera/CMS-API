import {Express} from 'express'
import {authenticate} from "../middlewares/authentication.middleware";
import {get_page_, page_create, create_page_tag_, get_page_tag_} from "../controllers/page.controller";

const routes = (app:Express) => {
    app.post('/page',authenticate, page_create)
    app.get('/page/:id', get_page_)
    app.post('/page/tag', authenticate, create_page_tag_)
    app.get('/page/tag/:id', get_page_tag_)
}

export default routes

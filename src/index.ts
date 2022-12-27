import express, {Express, response} from 'express';
import dotenv from 'dotenv';
import routes from "./routes/authentication.routes";
import site_routes from "./routes/site.routes"
import page_routes from "./routes/page.routes"
import {error_handler} from "./middlewares/error.middleware";
import "reflect-metadata"


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json())

routes(app)
site_routes(app)
page_routes(app)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});


app.use(error_handler)


module.exports = app

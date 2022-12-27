import {DataSource} from "typeorm";
import {Client} from "../models/client.model";
import {Page} from "../models/page.model";
import {PageTag} from "../models/page_tag.model";
import {Section} from "../models/section.model";
import {Site} from "../models/site.model";
import {User} from "../models/user.model";

export const AppDataSource : DataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "juampi1998",
    database: "proto_cms_dev",
    synchronize: true,
    entities: [
        Client,
        Page,
        PageTag,
        Section,
        Site,
        User,
    ],
    subscribers: [],
    migrations: [],
})

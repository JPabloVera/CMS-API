import {IPageTag} from "../types/models/page_tag.interface";
import {Site} from "./site.model";
import {Page} from "./page.model";
import {User} from "./user.model";
import {
    Column,
    CreateDateColumn,
    Entity, JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class PageTag implements IPageTag {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @ManyToMany(() => Page, page => page.tags)
    pages: Page[];

    @ManyToOne(() => Site, site => site.page_tags)
    @JoinTable()
    site: Site;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

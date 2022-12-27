import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, UpdateDateColumn} from "typeorm"
import {ISite} from "../types/models/site.interface";
import {Client} from "./client.model";
import {Page} from "./page.model";
import {PageTag} from "./page_tag.model";

@Entity()
export class Site implements ISite {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ type: "varchar", length: 100, unique: true, nullable: false })
    url: string;

    @OneToMany(()=> Page, (page) => page.site)
    pages: Page[]

    @ManyToOne(()=> PageTag, (page) => page.site)
    page_tags: PageTag[]

    @Column({ type: 'json', nullable: true })
    metadata?: JSON

    @Column({ default: 0 })
    visitors: number

    @ManyToOne(() => Client, (client) => client.sites)
    owner: Client;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: false})
    landing_page: string

}

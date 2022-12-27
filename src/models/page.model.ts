import {IPage} from "../types/models/page.interface";
import {PageTag} from "./page_tag.model";
import {Site} from "./site.model";
import {Section} from "./section.model";
import {
    Column,
    CreateDateColumn, Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class Page implements IPage {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    url: string;

    @ManyToMany(() => PageTag, tag => tag.pages)
    tags: PageTag[];

    @ManyToOne(() => Site, site => site.pages)
    site: Site;

    @OneToMany(() => Section, section => section.page)
    sections: Section[];

    @Column({ type: 'json', nullable: true })
    metadata?: JSON;

    @Column({ default: 0})
    visitors: number;

    @Column({default: false})
    public: Boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

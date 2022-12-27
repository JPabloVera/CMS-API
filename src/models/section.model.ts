import {ISection} from "../types/models/section.interface";
import {User} from "./user.model";
import {Page} from "./page.model";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Section implements ISection {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({nullable: false})
    html_content: string;

    @Column({ type: 'json' })
    metadata?: JSON;

    @Column({nullable: false})
    name: string;

    @ManyToOne(() => Page, page => page.sections)
    page: Page;

    @UpdateDateColumn()
    updated_at: Date;
}

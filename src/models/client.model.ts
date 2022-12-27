import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany} from "typeorm"
import {IClient, ClientTypes} from "../types/models/client.interface";
import {User} from "./user.model";
import {Site} from "./site.model";

@Entity()
export class Client implements IClient {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 300, unique: true })
    name: string;

    @Column()
    nice_name: string

    @Column()
    active: boolean;

    @Column({ type: "enum", enum: ["Administrator", "Regular"], default: "Regular" })
    type: ClientTypes;

    @OneToMany(() => User,
        (user) => user.parent,
        { cascade: true }
    )
    users: User[];

    @OneToMany(() => Site,
        (site) => site.owner,
        { cascade: true }
    )
    sites: Site[]

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;
}

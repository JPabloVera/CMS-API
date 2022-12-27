import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    UpdateDateColumn,
} from "typeorm"
import {IUser, UserStatus} from "../types/models/user.interface";
import {Client} from "./client.model";

@Entity()
export class User implements IUser {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Client, (client) => client.users)
    parent: Client;

    @Column({ type: "enum", enum: ["active", "inactive"], default: "active" })
    status: UserStatus;

    @Column({ nullable: false })
    first_name: string;

    @Column( { nullable: false })
    last_name: string;

    @Column({ type: "varchar", length: 50, unique: true, nullable: false })
    email: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    password: string;

    @Column( { type: 'json', nullable: true })
    location?: JSON

    @Column( { type: 'json', nullable: true })
    metadata: JSON

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}



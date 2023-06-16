import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user-entity'

type Msg = {
	content: string;
	sender_socket_id: string;
	username: string;
	avatar: string;
    auth_id: string;
	room: string;
};

export type ErrorType = {
    statusCode: number;
    message: string;
}

@Entity('chan')
export class ChanEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        name: 'type',
        type: 'varchar',
        nullable: false,
    })
    type: string;

    @Column({
        unique: true,
        type: 'varchar',
        nullable: false,
    })
    name: string;

	@Column({
		name: 'owner',
		type: 'varchar',
		nullable: false,
	})
	owner: string;

    @Column({
        name: 'password',
        type: 'varchar',
        nullable: true,
    })
    password?: string;

    @Column({
        name: 'admin',
        type: 'varchar',
        array: true,
        nullable: true,
    })
    admin: Array<string>;

	@Column({
		name: 'messages',
        type: 'varchar',
		array: true,
		//default: '',
		nullable: true,
	})
	messages: Msg[];

	@ManyToMany(() => UserEntity, (user) => user.channelJoined, {
        //cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
	@JoinTable()
	chanUser: UserEntity[];

	@ManyToMany(() => UserEntity, (user) => user.channelBanned, {
        //cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
	@JoinTable()
	banUser: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.channelMuted, {
        //cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinTable()
    muteUser: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.channelAdmin, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinTable()
    adminUser: UserEntity[];
}
export default ChanEntity;
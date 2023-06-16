import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HistoryEntity } from '../../parties/entities/history-entity';
import { Exclude } from 'class-transformer';
import { ChanEntity } from '../../chans/entities/chan-entity';
// import { ProfileEntity } from './profile-entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  auth_id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    unique: true,
    nullable: false,
    update: false,
  })
  email: string;

  @Column({
    default: 'default.jpg',
  })
  avatar: string;

  @OneToMany(() => HistoryEntity, (parties) => parties.game_id)
  parties: HistoryEntity[];

  @Column({
    type: 'int',
    default: 0,
  })
  game_won: number;

  @Column({
    default: 0,
    type: 'int',
  })
  game_lost: number;

  @Column({
    type: 'int',
    default: 0,
  })
  total_games: number;

  @Column({
    type: 'int',
    default: 0,
  })
  total_score: number;

  @Column({
    type: 'int',
    default: 0,
  })
  status: number;

  /*
  @Type(() => UserEntity)
  @JoinTable({ name: 'users_id_1' })
  @ManyToMany(() => UserEntity, {
    cascade: true,
  })
  */
  @Column('simple-array', { default: [] })
  friends: string[];

  /*
  @Type(() => UserEntity)
  @JoinTable({ joinColumn: { name: 'UserEntity_blocked_id_1' } })
  @ManyToMany(() => UserEntity, { cascade: true })
  */
  @Column('simple-array', { default: [] })
  blocked: string[];

  @Exclude()
  @Column({
    default: '',
    nullable: true,
  })
  twoFASecret: string;

  @Column({
    default: 0,
  })
  isTwoFA: number;

  @Column({
    default: () => '((CURRENT_DATE))',
    update: false,
  })
  createdAt: Date;

  @ManyToMany(() => ChanEntity, (chan) => chan.chanUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  channelJoined: ChanEntity[];

  @ManyToMany(() => ChanEntity, (chan) => chan.banUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  channelBanned: ChanEntity[];

  @ManyToMany(() => ChanEntity, (chan) => chan.muteUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  channelMuted: ChanEntity[];

  @ManyToMany(() => ChanEntity, (chan) => chan.adminUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  channelAdmin: ChanEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
export default UserEntity;

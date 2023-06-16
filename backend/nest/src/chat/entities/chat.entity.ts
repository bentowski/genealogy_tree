import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('chat')
export class Chat {
 @PrimaryGeneratedColumn('uuid')
 id: number;

 @Column()
 email: string;

 @Column({ unique: true })
 text: string;

 // @CreateDateColumn()
 // createdAt: Date;
}
export default Chat;
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'parties' })
export class PartiesEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'parties_id',
  })
  public id: number;

  @Column({
    nullable: false,
  })
  public login: string;

  @Column({
    nullable: false,
  })
  public nbplayer: number;

  @Column({
    nullable: false,
  })
  public type: number;

  @Column({
    nullable: false,
  })
  public vitesse: number;

  @Column({
    nullable: true,
  })
  public p1: string;

  @Column({
    nullable: true,
  })
  public p2: string;
}
export default PartiesEntity;

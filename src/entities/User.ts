import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Matches, IsNotEmpty } from 'class-validator';

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  @IsNotEmpty()
  @Matches(/^(?=.{1,25}$)(?!.*__.*)(?!.*\.\..*)[a-zA-Z0-9_.]+$/)
  username!: string;

  @Column()
  @IsNotEmpty()
  @Matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  email!: string;

  @Column()
  @IsNotEmpty()
  password!: string;

  @Column()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9. ]+$/)
  firstname!: string;

  @Column()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9. ]+$/)
  lastname!: string;

}

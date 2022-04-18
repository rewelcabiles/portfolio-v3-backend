import { IsDate, IsEmail, IsString } from 'class-validator';
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';


@Entity('user')
export class User {
  @ObjectIdColumn() 
  id: ObjectID;
  
  @IsString()
  @Column() 
  username: string;
  
  @IsString()
  @Column() 
  password: string;
  
  @IsEmail()
  @Column() 
  email: string;
  
  @Column() 
  role: string;
  
  @IsDate()
  @Column() 
  dateCreated: Date;
}

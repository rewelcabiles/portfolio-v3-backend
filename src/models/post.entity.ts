import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { IsDate, IsNotEmpty, IsString, validate } from 'class-validator';
import { ObjectID } from 'mongodb';

@Entity('post')
export class Post {
    @ObjectIdColumn() 
    id: ObjectID;
    
    @IsNotEmpty()
    @IsString()
    @Column() 
    title: string;
    
    @IsString()
    @Column() 
    content: string;
    
    @IsNotEmpty()
    @Column() 
    author: ObjectID;
    
    @IsNotEmpty()
    @Column()
    projectId: ObjectID;
    
    @IsDate()
    @Column() 
    dateCreated: Date;
    
    @IsDate()
    @Column() 
    last_update: Date;
    
}

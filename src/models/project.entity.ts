import { IsArray, IsDate, IsString, Validate } from 'class-validator';
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('project')
export class Project {
    @ObjectIdColumn()
    id: ObjectID;
    
    @Column()
    name: string;
    
    @IsString()
    @Column()
    description: string;
    
    @IsString()
    @Column()
    safe_name: string;
    
    @IsString()
    @Column()
    banner: string;
    
    @IsArray()
    @Column()
    tags: Array<String>;
    
    @Column()
    projectLink: string;
    
    @IsDate()
    @Column()
    dateCreated: Date;
    
    @IsDate()
    @Column()
    last_update: Date;
    
}


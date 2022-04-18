import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/models/post.entity';
import { Project } from 'src/models/project.entity';
import { MongoRepository } from 'typeorm';
import { validate } from 'class-validator';
import { ObjectID } from 'mongodb';


@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: MongoRepository<Project>,
        @InjectRepository(Post)
        private readonly PostRepository: MongoRepository<Post>,
    ) {}

    async findOneByName(name){
        return await this.projectRepository.findOne({name: name});
    }

    async getProjects(query?:any) {
        if (query.safe_name) {
            return await this.projectRepository.find({safe_name: query.safe_name});
        } else {
            return await this.projectRepository.find();
        }
    }

    async createProject(body){
        // Check if project name exists
        let projectExists = await this.projectRepository.findOne({name: body.name});
        if (projectExists) {
            throw new HttpException({message:'Project name already exists'}, HttpStatus.BAD_REQUEST);
            //return { status: 400, message: ["Project name already exists"] };
        }
        let project = new Project();
        project.name = body.name;
        project.description = body.description;
        project.safe_name = body.name.replace(/\s+/g, '_').toLowerCase();
        project.banner = body.banner;
        project.tags = body.tags;
        project.projectLink = body.projectLink;
        project.dateCreated = new Date();
        project.last_update = new Date();

        return validate(project, { validationError: { target: false } }).then(errors => {
            if (errors.length > 0) {
                console.log("Error!")
                console.log(errors)
                throw new HttpException(errors, HttpStatus.BAD_REQUEST);
            } else{
                console.log("Success!")
                this.projectRepository.save(project);
                throw new HttpException('Project created successfully', HttpStatus.CREATED);
            }
        });
    }

    async deleteProject(safe_name: string) {
        let project = await this.projectRepository.findOne({safe_name: safe_name});
        if (project) {
            await this.projectRepository.delete(project);
            console.log("Deleted")
            throw new HttpException({message: 'Project deleted successfully'}, HttpStatus.OK);
        }
        throw new HttpException({message: "Project not found"}, HttpStatus.NOT_FOUND);
        }

        
    async updateProject(body){
        let project = await this.projectRepository.findOne({safe_name: body.safe_name});

        if (project) {
            project.name = body.name;
            project.description = body.description;
            project.safe_name = body.name.replace(/\s+/g, '_').toLowerCase();
            project.banner = body.banner;
            project.tags = body.tags;
            project.projectLink = body.projectLink;
            project.last_update = new Date();
            await this.projectRepository.save(project);
            throw new HttpException({message: 'Project updated successfully'}, HttpStatus.OK);
        }
        throw new HttpException({message: "Project not found"}, HttpStatus.NOT_FOUND);
    }
    
    async getProjectPosts(safe_name: string) {
        let project = await this.projectRepository.findOne({safe_name: safe_name});
        if (project) {
            var posts = await this.PostRepository.aggregate([{
                $match: { projectId: project.id }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $set: 
                { 
                    author: "$author.username"
                } 
             },
            {
                $unwind:"$author"
            }]).toArray();
            console.log(posts)
            return posts
        }
        throw new HttpException({message: "Project not found"}, HttpStatus.NOT_FOUND);

       


    }
    
    async createProjectPost(safe_name, body, user){
        let project = await this.projectRepository.findOne({safe_name: safe_name});
        console.log(user)
        if (project) {
            let post = new Post();
            post.title = body.title;
            post.content = body.content;
            post.projectId = project.id;
            post.author = ObjectID(user.id);
            post.dateCreated = new Date();
            post.last_update = new Date();
            console.log(post)
            await this.PostRepository.save(post);
            throw new HttpException({message: 'Post created successfully'}, HttpStatus.CREATED);
        }
        throw new HttpException({message: "Project not found"}, HttpStatus.NOT_FOUND);
    }
}

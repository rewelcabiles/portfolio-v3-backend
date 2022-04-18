import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserInterface } from 'src/models/user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>,
    ){}


    async loginUser(user: UserInterface) {
        let userToLogin = await this.userRepository.findOne({username: user.username});
        if (userToLogin) {
            let isValid = await bcrypt.compare(user.password, userToLogin.password);
            if (isValid) {
                let user = {  'username': userToLogin.username, 'email': userToLogin.email, 'role': userToLogin.role }
                throw new HttpException(user, HttpStatus.OK);
          }
        }
        throw new HttpException('Invalid username or password', HttpStatus.BAD_REQUEST);
    }
    
    @UseGuards(JwtAuthGuard)
    async registerUser(user: User): Promise<User> {
        let newUser = new User();
        await bcrypt.hash(user.password, 10).then(function(hash) {
            newUser.username = user.username;
            newUser.password = hash;
            newUser.email = user.email;
            newUser.role = "default";
            newUser.dateCreated = new Date();
        });
        return await this.userRepository.save(newUser);
    }

    // Findone
    async findOneByUsername(username: string): Promise<User | undefined> {
        return await this.userRepository.findOne({username: username});
    }
}

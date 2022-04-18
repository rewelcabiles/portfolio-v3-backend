import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService
    ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log("Validating User")
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
        let isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            const { password, ...result } = user;
            console.log("RESULT")
            console.log(result)
            return result;
        }
    }
    console.log("Err")
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, id: user.id, role: user.role };
    return {
        access_token: this.jwtService.sign(payload),
        user: payload
    };
  }
}

import { ObjectID } from 'typeorm';

export interface UserInterface {
    username: string;
    password: string;
    email: string;
}

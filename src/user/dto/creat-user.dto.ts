import {IsString, IsEmail, IsStrongPassword } from "class-validator";

export class CreateUserDTO{
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase:1,
        minSymbols:1

    })
    password: string;
}
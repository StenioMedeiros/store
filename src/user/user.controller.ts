import { Body, Controller, Post, Get, Param, Put, Patch, Delete} from "@nestjs/common";
import { CreateUserDTO } from "./dto/creat-user.dto";
import {UpdatePutUserDTO} from "./dto/update-put-user.dto"
import {UpdatePatchUserDTO} from "./dto/update-patch-user.dto"

@Controller('users')
export class UserController{

    @Post()
    async creat(@Body() {name,email,password}: CreateUserDTO){
        return {name, email, password};
    }
    @Get()
    async read(){
        return {users:[]}
    }
    @Get(':id')
    async readOne(@Param() paras){
        return {users: {}, paras}
    }

    @Put(':id')
    async update(@Body() {name,email,password}: UpdatePutUserDTO , @Param() params){
        return {
            method: 'put',
            name,email,password,
            params
        }
    }

    @Patch(':id')
    async updatePartial(@Body() body:UpdatePatchUserDTO, @Param() params){
        return {
            method: 'patch',
            body,
            params
        }
    }

    @Delete(':id')
    async delete(@Param() params){
        return {
            params
        }
    }



}
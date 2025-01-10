import { Body, Controller, Post, Get, Param, Put, Patch, Delete, ParseIntPipe} from "@nestjs/common";
import { CreateUserDTO } from "./dto/creat-user.dto";
import {UpdatePutUserDTO} from "./dto/update-put-user.dto"
import {UpdatePatchUserDTO} from "./dto/update-patch-user.dto"
import { UserService } from "./user.service";

@Controller('users')
export class UserController{

    constructor(private readonly useerService: UserService ){}

    @Post()
    async creat(@Body() data: CreateUserDTO){
        return this.useerService.create(data);
    }
    @Get()
    async list(){
        return  this.useerService.list();
    }
    @Get(':id')
    async readOne(@Param('id', ParseIntPipe) id: number){
        return this.useerService.readOne(id);
    }
/*
    @Put(':id')
    async update(@Body() {name,email,password}: UpdatePutUserDTO , @Param() params){
        return {
            method: 'put',
            name,email,password,
            params
        }
    }
*/
    @Patch(':id')
    async updatePartial(@Body() data:UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number){
        return this.useerService.updatPartial(id, data);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number){
        return this.useerService.delet(id);
    }



}
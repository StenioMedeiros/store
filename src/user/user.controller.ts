import { Body, Controller, Post, Get, Param, Put, Patch, Delete, ParseIntPipe} from "@nestjs/common";
import { CreateUserDTO } from "./dto/creat-user.dto";
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
    async findAll(){
        return  this.useerService.findAll();
    }
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number){
        return this.useerService.findOne(id);
    }

    @Patch(':id')
    async updatePartial(@Body() data:UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number){
        return this.useerService.updatPartial(id, data);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number){
        return this.useerService.delet(id);
    }



}
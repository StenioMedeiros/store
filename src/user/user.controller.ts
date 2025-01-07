import { Body, Controller, Post, Get, Param, Put, Patch, Delete} from "@nestjs/common";

@Controller('users')
export class UserController{

    @Post()
    async creat(@Body() body){
        return {body};
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
    async update(@Body() body, @Param() params){
        return {
            method: 'put',
            body,
            params
        }
    }

    @Patch(':id')
    async updatePartial(@Body() body, @Param() params){
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
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/creat-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";

@Injectable()
export class UserService{

    constructor(private readonly prisma: PrismaService){}

    async create(data: CreateUserDTO){
        return this.prisma.users.create({
            data
        });
    }

    async list(){
        return this.prisma.users.findMany();
    }

    async readOne(id: number){
        return this.prisma.users.findUnique({
            where:{
                id
            }
        });
    }

    async updatPartial(id: number, data: UpdatePatchUserDTO){
        return this.prisma.users.update({
            data,
            where: {
                id
            }
        })
    }

    async delet(id: number){
        if (!(await this.readOne(id))){
            throw new NotFoundException(`O usuario ${id} não existe`);
        }

        return this.prisma.users.delete({
            where:{
                id
            }
        })
    }

}
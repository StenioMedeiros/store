import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateStoresrDTO } from "./dto/crieat-Stores.dto";

@Injectable()
export class StoresService {
    constructor(private readonly prisma: PrismaService) {}

    // Método para criar uma nova loja
    async create(data: CreateStoresrDTO) {
        return this.prisma.stores.create({
            data
        });
    }

    // Método para listar todas as lojas com paginação
    async findAll(limit: number = 10, offset: number = 0) {
        return this.prisma.stores.findMany({
            take: limit,
            skip: offset,
        });
    }

    // Método para buscar uma loja pelo ID
    async findOne(id: number) {
        
        const store = await this.prisma.stores.findUnique({
            where: { id },
        });
        if (!store) {
            throw new NotFoundException(`Loja com ID ${id} não encontrada`);
        }
        return store;
    }

    // Método para listar lojas por estado com paginação
    async storeByState(state: string, limit: number = 10, offset: number = 0) {

        return this.prisma.stores.findMany({
            where: { state },
            take: limit,
            skip: offset,
        });
    }

    // Método para listar lojas por CEP com paginação
    async storeByCep(postal_code: string, limit: number = 10, offset: number = 0) {
        return this.prisma.stores.findMany({
            where: { postal_code },
            take: limit,
            skip: offset,
        });
    }

    // Método para atualizar parcialmente uma loja pelo ID
    async update(id: number, data: Partial<CreateStoresrDTO>) {
        const store = await this.findOne(id); // Garante que a loja existe antes de atualizar
        return this.prisma.stores.update({
            where: { id: store.id },
            data,
        });
    }

    // Método para remover uma loja pelo ID
    async remove(id: number) {
        const store = await this.findOne(id); // Garante que a loja existe antes de deletar
        return this.prisma.stores.delete({
            where: { id: store.id },
        });
    }
}

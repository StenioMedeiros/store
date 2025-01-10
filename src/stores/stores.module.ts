import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { StoresController } from "./stores.controller";
import { StoresService } from "./stores.service";

@Module({
    imports: [PrismaModule],
    controllers: [StoresController],
    providers: [StoresService],
    exports: []
})
export class StoresModule{}
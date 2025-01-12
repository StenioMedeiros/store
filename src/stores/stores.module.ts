import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { StoresController } from "./stores.controller";
import { StoresService } from "./stores.service";
import {UtilModule} from "../utils/utils.module"


@Module({
    imports: [PrismaModule, UtilModule],
    controllers: [StoresController],
    providers: [StoresService],
    exports: []
})
export class StoresModule{}
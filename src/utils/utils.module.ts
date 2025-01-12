import { Module } from "@nestjs/common";
import { ViaCepService } from "./get_info_address";
import { ConverterCepService } from "./get_info_coordinates";



@Module({
    providers: [ViaCepService, ConverterCepService],
    exports: [ViaCepService, ConverterCepService]
})
export class UtilModule{

}
import { Module } from "@nestjs/common";
import { ViaCepService } from "./get_info_address";
import { ConverterCepService } from "./get_info_coordinates";
import {CorreiosService} from "./get_info_ freight"
import {DistanceService} from "./calculate_distance"



@Module({
    providers: [ViaCepService, ConverterCepService, CorreiosService, DistanceService],
    exports: [ViaCepService, ConverterCepService, CorreiosService,DistanceService]
})
export class UtilModule{

}
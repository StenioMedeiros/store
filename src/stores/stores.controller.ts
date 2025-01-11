import {Body, Controller, Post, Get, Param, Query, Patch, Delete, ParseIntPipe, UsePipes, ValidationPipe} from "@nestjs/common";
import { StoresService } from "./stores.service";
import { CreateStoresrDTO } from "./dto/crieat-Stores.dto";
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiResponse } from "@nestjs/swagger";

@ApiTags('stores')
@Controller('stores')
export class StoresController {
    constructor(private readonly storeService: StoresService) {}

    @Post()
    @ApiOperation({ summary: 'Cria uma nova loja' })
    @ApiBody({ type: CreateStoresrDTO })
    @ApiResponse({ status: 201, description: 'Loja criada com sucesso' })
    async create(@Body() data: CreateStoresrDTO) {
        return this.storeService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todas as lojas com paginação' })
    @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de lojas a serem retornadas', example: 10 })
    @ApiQuery({ name: 'offset', required: false, description: 'Número de lojas a serem ignoradas', example: 0 })
    @ApiResponse({ status: 200, description: 'Lista de lojas retornada com sucesso' })
    async findAll(@Query('limit') limit: number = 10, @Query('offset') offset: number = 0) {
        return this.storeService.findAll(limit, offset);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca uma loja pelo ID' })
    @ApiParam({ name: 'id', description: 'ID da loja a ser buscada', example: '1234' })
    @ApiResponse({ status: 200, description: 'Loja encontrada com sucesso' })
    @ApiResponse({ status: 404, description: 'Loja não encontrada' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.storeService.findOne(id);
    }

    @Get('state/:state')
    @ApiOperation({ summary: 'Lista lojas por estado com paginação' })
    @ApiParam({ name: 'state', description: 'Estado para filtrar as lojas', example: 'PE' })
    @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de lojas a serem retornadas', example: 10 })
    @ApiQuery({ name: 'offset', required: false, description: 'Número de lojas a serem ignoradas', example: 0 })
    async storeByState(
        @Param('state') state: string,
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0
    ) {
        return this.storeService.storeByState(state, limit, offset);
    }

    @Get('cep/:postalCode')
    @ApiOperation({ summary: 'Lista lojas por CEP com paginação' })
    @ApiParam({ name: 'postalCode', description: 'CEP para filtrar as lojas', example: '55000000' })
    @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de lojas a serem retornadas', example: 10 })
    @ApiQuery({ name: 'offset', required: false, description: 'Número de lojas a serem ignoradas', example: 0 })
    async storeByCep(
        @Param('postalCode') postalCode: string,
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0
    ) {
        return this.storeService.storeByCep(postalCode, limit, offset);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza parcialmente uma loja pelo ID' })
    @ApiParam({ name: 'id', description: 'ID da loja a ser atualizada', example: '1234' })
    @ApiBody({ description: 'Dados a serem atualizados', type: CreateStoresrDTO })
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<CreateStoresrDTO>) {
        return this.storeService.update(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deleta uma loja pelo ID' })
    @ApiParam({ name: 'id', description: 'ID da loja a ser deletada', example: '1234' })
    @ApiResponse({ status: 200, description: 'Loja deletada com sucesso' })
    @ApiResponse({ status: 404, description: 'Loja não encontrada' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.storeService.delete(id);
    }
}


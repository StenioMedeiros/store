import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException  } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateStoresrDTO } from "./dto/crieat-Stores.dto";
import { ViaCepService } from "../utils/get_info_address";
import { ConverterCepService } from "../utils/get_info_coordinates";

@Injectable()
export class StoresService {
   constructor(
    private readonly prisma: PrismaService,
    private readonly viaCepService: ViaCepService,
    private readonly converterCepService: ConverterCepService,
  ) {}
  
  
  async create(data: CreateStoresrDTO) {
    const {name, email, postal_code, telephone_number, take_out_in_store, type, latitude, longitude, 
        logradouro, number, city, district, state,} = data;
    // Validação de campos obrigatórios
    const requiredFields = {
      name,
      email,
      postal_code,
      telephone_number,
      take_out_in_store,
      type,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        throw new BadRequestException(`O campo "${field}" é obrigatório.`);
      }
    }
      // Converte take_out_in_store para booleano
    data.take_out_in_store = Boolean(data.take_out_in_store);;
    
    /*if (typeof take_out_in_store !== 'boolean') {
    throw new BadRequestException(
      'O campo "take_out_in_store" deve ser um valor booleano.',
    );
  }*/

    // Validação do CEP
    const isValidCep = /^[0-9]{8}$/.test(postal_code);
    if (!isValidCep) {
      throw new BadRequestException(
        'O campo "postal_code" deve ser um CEP válido de 8 dígitos.',
      );
    }

    // Busca o endereço completo a partir do CEP
    let enderecoCompleto;
    try {
      enderecoCompleto = await this.viaCepService.getAddressByCep(postal_code);
    } catch (error) {
      throw new BadRequestException('CEP inválido ou não encontrado.');
    }

    // Preenche o endereço com os dados fornecidos ou com os dados da busca
    const novoEndereco = {
      logradouro: logradouro || enderecoCompleto.logradouro.toString(),
      district: district || enderecoCompleto.district.toString(),
      city: city || enderecoCompleto.city.toString(),
      state: state || enderecoCompleto.state.toString(),
      postal_code,
      number,
    };

    // Verifica se todos os campos obrigatórios do endereço estão preenchidos
    const addressRequiredFields = ['logradouro', 'district', 'city', 'state'];
    const missingFields = addressRequiredFields.filter(
      (field) => !novoEndereco[field],
    );
    if (missingFields.length > 0) {
      throw new BadRequestException(`Os seguintes campos do endereço estão pendentes e precisam ser fornecidos: ${missingFields.join( ', ',  )}`, );
    }

    // Obter coordenadas a partir do CEP, caso não fornecidas
    let novasCoordenadas = { latitude, longitude };
    if (!latitude || !longitude) {
      const coordenadasCepLoja = await this.converterCepService.convertCepInCoordinate(
        postal_code
      );
      if (!coordenadasCepLoja) {
        throw new BadRequestException( 'Coordenadas não encontradas para o CEP fornecido. Por favor, forneça latitude e longitude.',);
      }
      novasCoordenadas = {
        latitude: coordenadasCepLoja.lat,
        longitude: coordenadasCepLoja.lng,
      };
    }
    
    data.latitude= novasCoordenadas.latitude,
    data.longitude= novasCoordenadas.longitude,
    data.logradouro= novoEndereco.logradouro,
    data.district= novoEndereco.district,
    data.city= novoEndereco.city,
    data.state= novoEndereco.state
        
    console.log(data)// Criação da loja no banco de dados
    try {
        return {
          ...(await this.prisma.stores.create({
            data,
          })),
          message: 'Store created successfully!',
        };
      }catch (error) {
        if (error.code === 'P2002') {
          throw new BadRequestException('O e-mail informado já está em uso.');
        }
        throw new InternalServerErrorException(
          'Erro ao criar loja no banco de dados.',
        );
    }
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
    async delete(id: number) {
        const store = await this.findOne(id); // Garante que a loja existe antes de deletar
        return this.prisma.stores.delete({
            where: { id: store.id },
        });
    }
}




import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, HttpException, HttpStatus} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateStoresrDTO } from "./dto/crieat-Stores.dto";
import { ViaCepService } from "../utils/get_info_address";
import { ConverterCepService } from "../utils/get_info_coordinates";
import {DistanceService} from "../utils/calculate_distance"
import { CorreiosService } from "../utils/get_info_ freight"
import {Coordinates} from "../utils/types/coordinates.interface"

@Injectable()
export class StoresService {
   constructor(
    private readonly prisma: PrismaService,
    private readonly viaCepService: ViaCepService,
    private readonly converterCepService: ConverterCepService,
    private readonly CorreiosService: CorreiosService,
    private readonly DistanceService: DistanceService,
  ) {}
  
  
  async create(data: CreateStoresrDTO) {
    const {name, email, postal_code, telephone_number, take_out_in_store, type, latitude, longitude, 
        logradouro, number, city, district, state,} = data;

    // Validação de campos obrigatórios
    const requiredFields = {name, email,  postal_code, telephone_number, take_out_in_store,  type, };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        throw new BadRequestException(`O campo "${field}" é obrigatório.`);
      }
    }
      // Converte take_out_in_store para booleano
    data.take_out_in_store = Boolean(data.take_out_in_store);;
    
    if (data.take_out_in_store !== true && data.take_out_in_store !== false) {
    throw new BadRequestException('O campo "take_out_in_store" deve ser um valor booleano.',);}

    // Validação do CEP
    const isValidCep = /^[0-9]{8}$/.test(postal_code);
    if (!isValidCep) {
      throw new BadRequestException('O campo "postal_code" deve ser um CEP válido de 8 dígitos.',);}

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
    const missingFields = addressRequiredFields.filter((field) => !novoEndereco[field],);

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
        latitude: coordenadasCepLoja.latitude,
        longitude: coordenadasCepLoja.longitude,
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



  // Método para listar todas as lojas com paginação usando Prisma
  async listAll(limit: number = 10, offset: number = 0) {
    try {
      const total = await this.prisma.stores.count(); // Conta o número total de lojas
      const stores = await this.prisma.stores.findMany({ take: limit, skip: offset, 
  });
      return {stores, limit, offset, total, };
    } catch (error) {
      console.error(`Erro ao listar lojas: ${error.message}`);
      throw new HttpException('Erro ao listar lojas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



    // Método para buscar uma loja pelo ID
    async storeById(id: number) {
        
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



    async storeByCep(postal_code: string, limit = 5, offset = 0): Promise<any> {
      // Limpeza e validação do CEP
      const cleanedPostalCode = postal_code.replace('-', '');
      if (!/^[0-9]{8}$/.test(cleanedPostalCode)) {
        throw new BadRequestException('O campo "postal_code" deve ser um CEP válido de 8 dígitos.');
      }
      // Obtenção das coordenadas do usuário a partir do CEP
      let userCoordinates: Coordinates;
      try {
        userCoordinates = await this.converterCepService.convertCepInCoordinate(cleanedPostalCode);
      } catch (error) {
        console.error(`Erro ao converter o CEP do usuário: ${error.message}`);
        throw new BadRequestException('Erro ao converter o CEP do usuário.');
      }

      // Busca lojas do banco de dados
      let storess;
      try {
        storess = await this.prisma.stores.findMany({
          where: { type: { in: ['Loja', 'PDV'] } },
          take: limit,
          skip: offset,
        });
      } catch (error) {
        console.error(`Erro ao buscar lojas no banco de dados: ${error.message}`);
        throw new InternalServerErrorException('Erro ao buscar lojas.');
      }

      // Inicializa os arrays de detalhes das lojas e pins para o mapa
      const storeDetails: any[] = [];
      const pins: any[] = [];

      for (const store of storess) {
        const storeCoordinates: Coordinates = {latitude: parseFloat(store.latitude.toString()),
                                            longitude: parseFloat(store.longitude.toString()),};

        // Calcula a distância entre o usuário e a loja
        const distan = await this.DistanceService.calculateDistance(
        `${userCoordinates.latitude},${userCoordinates.longitude}`, 
        `${storeCoordinates.latitude},${storeCoordinates.longitude}`); 
        
        // Convertendo a distância para um valor numérico (em km) para a comparação
        let distance = parseFloat(distan.replace(' km', '').replace('.', ''));

        if ( distance <= 50  || store.type === 'Loja') {
            const storeDetail: any = {
            name: store.name,
            city: store.city,
            postalCode: store.postal_code,
            type: store.type,
            distance: `${distance.toFixed(2)} km`,
            value: [],
          };

          // Se a distância for menor ou igual a 50 km, adiciona opção de motoboy
          if (distance <= 50) {
            storeDetail.value.push({
            prazo: 'Até 2 dias uteis', // Prazo entre 1 e 2 dias
            price: 'R$ 15,00',
            description: 'Motoboy',
            });
          } else if (store.type === 'Loja') {
            try {
              // Calcula o frete para lojas do tipo "LOJA"
              const freight = await this.CorreiosService.calculateShipping(
                cleanedPostalCode,  // destino (cepDestino)
                store.postal_code.replace('-', ''),  // origem (cepOrigem)

              );
              
              if (Array.isArray(freight)) {
                storeDetail.value = freight;
              } else {
                storeDetail.value = []; // Caso a resposta não seja um array, atribui um valor padrão
              }
            } catch (error) {
              console.error(`Erro ao calcular o frete para a loja ${store.name}: ${error.message}`);
            }
          }

          storeDetails.push(storeDetail);

          // Adiciona coordenadas para os pins do mapa
          pins.push({
            position: {
              lat: storeCoordinates.latitude,
              lng: storeCoordinates.longitude,
            },
            title: store.name,
          });
        }
      }

      // Ordena as lojas pela distância em ordem crescente
      storeDetails.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      // Retorna os dados paginados
      return {
        stores: storeDetails.slice(offset, offset + limit),
        pins,
        limit,
        offset,
        total: storeDetails.length,
      };
    }



        // Método para atualizar parcialmente uma loja pelo ID
    async update(id: number, data: Partial<CreateStoresrDTO>) {
        // Garante que a loja existe antes de atualizar
        const store = await this.storeById(id);
        if (!store) {
          throw new Error(`Loja não encontrada com o ID: ${id}`);
        }
        const {name, email, postal_code, telephone_number, take_out_in_store, type, latitude, longitude, 
            logradouro, number, city, district, state,} = data;

        let novosDados: Partial<CreateStoresrDTO> = {};

        if (postal_code) {
          const coordenadasCepLoja = await this.converterCepService.convertCepInCoordinate(postal_code);
          if (!coordenadasCepLoja) {
            if (!latitude || !longitude) {
              throw new Error(
                'Coordenadas não encontradas para o CEP fornecido. Por favor, forneça latitude e longitude.'
              );
            }
            novosDados.latitude = latitude;
            novosDados.longitude = longitude;
          } else {
            novosDados.latitude = coordenadasCepLoja.latitude;
            novosDados.longitude = coordenadasCepLoja.longitude;
          }
        }
        
        const camposAtualizaveis = {name, email, telephone_number, take_out_in_store, type, logradouro, number, city, district, state, };

          for (const [campo, valor] of Object.entries(camposAtualizaveis)) {
            if (valor !== undefined) {
              novosDados[campo] = valor;
            }
          }

        // Atualiza os dados no banco de dados usando o Prisma
        return this.prisma.stores.update({
          where: { id: store.id },
          data: novosDados,
        });
      }
  

    // Método para remover uma loja pelo ID
    async delete(id: number) {
        const store = await this.storeById(id); // Garante que a loja existe antes de deletar
        return this.prisma.stores.delete({
            where: { id: store.id },
        });
    }
}




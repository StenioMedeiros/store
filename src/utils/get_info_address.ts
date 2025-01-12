import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ViaCepService {
  private readonly viacepBaseUrl = 'https://viacep.com.br/ws';

  // Mapeamento de estados para siglas
  private readonly estadoSigla: Record<string, string> = {
    'Acre': 'AC',
    'Alagoas': 'AL',
    'Amazonas': 'AM',
    'Bahia': 'BA',
    'Ceará': 'CE',
    'Distrito Federal': 'DF',
    'Espírito Santo': 'ES',
    'Goiás': 'GO',
    'Maranhão': 'MA',
    'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG',
    'Pará': 'PA',
    'Paraíba': 'PB',
    'Paraná': 'PR',
    'Pernambuco': 'PE',
    'Piauí': 'PI',
    'Rio de Janeiro': 'RJ',
    'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS',
    'Rondônia': 'RO',
    'Roraima': 'RR',
    'Santa Catarina': 'SC',
    'São Paulo': 'SP',
    'Sergipe': 'SE',
    'Tocantins': 'TO',
  };

  // Método para buscar o endereço a partir do CEP
  async getAddressByCep(postalCode: string) {
    try {
      const { data } = await axios.get(`${this.viacepBaseUrl}/${postalCode}/json/`);

      // Verifica se o CEP é inválido ou não encontrado
      if (data.erro) {
        throw new NotFoundException(`Endereço não encontrado para o CEP: ${postalCode}`);
      }

      // Mapeia o nome do estado para a sigla
      const estadoSigla = this.estadoSigla[data.estado];

      if (!estadoSigla) {
        throw new NotFoundException(`Sigla do estado não encontrada para: ${data.estado}`);
      }
      return {
        city: data.localidade,
        district: data.bairro,
        state: estadoSigla,
        logradouro: data.logradouro,
      };
    } catch (error) {
      // Lança uma exceção caso ocorra algum erro ao buscar o endereço
      throw new NotFoundException(`Endereço não encontrado ao buscar o CEP: ${postalCode}`);
    }
  }
}


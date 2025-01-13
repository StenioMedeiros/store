import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DistanceService {
  private readonly googleApiKey: string = process.env.GOOGLE_API_KEY;

  /**
   * Calcula a distância entre dois pontos usando a API Distance Matrix do Google.
   * @param origin Local de origem no formato "latitude,longitude".
   * @param destination Local de destino no formato "latitude,longitude".
   * @returns Distância calculada em formato de texto.
   */
  async calculateDistance(origin: string, destination: string): Promise<string> {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;

      const response = await axios.get(url, {
        params: {
          origins: origin,
          destinations: destination,
          key: this.googleApiKey,
          mode: 'driving',
          language: 'pt-BR',
        },
      });

      if (response.data.status !== 'OK') {
        throw new HttpException(
          `Erro na API do Google: ${response.data.error_message || 'Resposta inválida'}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const distanceText = response.data.rows[0].elements[0].distance?.text;

      if (!distanceText) {
        throw new HttpException(
          'Não foi possível calcular a distância. Dados incompletos retornados pela API.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return distanceText;
    } catch (error) {
      console.error('Erro ao calcular a distância:', error.response?.data || error.message);
      throw new HttpException(
        'Erro interno ao calcular a distância.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}



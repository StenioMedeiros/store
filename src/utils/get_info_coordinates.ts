import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface Coordenadas {
  lat: number;
  lng: number;
}

@Injectable()
export class ConverterCepService {
  private readonly logger = new Logger(ConverterCepService.name);

  async convertCepInCoordinate(cep: string): Promise<Coordenadas | null> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${process.env.GOOGLE_API_KEY}`,
      );

      const lojaLocation = response.data.results[0]?.geometry?.location;

      if (lojaLocation) {
        const { lat, lng } = lojaLocation;
        return { lat, lng };
      } else {
        this.logger.warn(`Nenhuma coordenada encontrada para o CEP ${cep}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Erro ao obter coordenadas para o CEP ${cep}: ${error.message}`);
      return null;
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Coordinates } from "./types/coordinates.interface"

@Injectable()
export class ConverterCepService {
  private readonly logger = new Logger(ConverterCepService.name);

  async convertCepInCoordinate(cep: string): Promise<Coordinates | null> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${process.env.GOOGLE_API_KEY}`,
      );

      // Verifica se há resultados e se a localização está presente
      const lojaLocation = response.data.results[0]?.geometry?.location;

      if (lojaLocation && lojaLocation.lat !== undefined && lojaLocation.lng !== undefined) {
        const { lat: latitude, lng: longitude } = lojaLocation;
        return { latitude, longitude };
      } else {
        this.logger.warn(`Nenhuma coordenada válida encontrada para o CEP ${cep}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Erro ao obter coordenadas para o CEP ${cep}: ${error.message}`);
      return null;
    }
  }
}


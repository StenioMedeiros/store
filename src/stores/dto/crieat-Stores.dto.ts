import { IsString, IsEmail, IsBoolean, IsNumber, IsOptional } from "class-validator";

export class CreateStoresrDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsString()
  address1: string;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsString()
  state: string;

  @IsString()
  type: string; // PDV | LOJA

  @IsString()
  postal_code: string;

  @IsString()
  telephone_number: string;

  @IsBoolean()
  take_out_in_store: boolean;

  @IsNumber()
  shipping_time_in_days: number;
}

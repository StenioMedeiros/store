import { IsString, IsEmail, IsBoolean, IsNumber,  IsNotEmpty, IsOptional } from "class-validator";

export class CreateStoresrDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;//rua

  @IsString()
  logradouro: string;

  @IsString()
  number: string;

  @IsString()
  city: string;

  @IsString()
  district: string;//bairro

  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  type: string; // PDV | LOJA

  @IsString()
  postal_code: string;//cep

  @IsNotEmpty()
  @IsString()
  telephone_number: string;

  @IsNotEmpty()
  @IsBoolean()
  take_out_in_store: boolean;//Se a loja permite retirada no local


}

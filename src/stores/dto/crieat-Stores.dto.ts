import { IsString, IsEmail, IsBoolean, IsNumber,  IsNotEmpty } from "class-validator";

export class CreateStoresrDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  district: string;//bairro
  // 
  city: string;

  state: string
  
  @IsString()
  postal_code: string;//cep
   
  @IsNotEmpty()
  @IsString()
  telephone_number: string;  
  
  @IsNotEmpty()
  @IsString()
  type: string; // PDV | LOJA  
  // 
  @IsNotEmpty()
  take_out_in_store: boolean;//Se a loja permite retirada no local
 
  latitude: number;

  longitude: number;//rua

  logradouro: string;

  @IsString()
  number: string;

}

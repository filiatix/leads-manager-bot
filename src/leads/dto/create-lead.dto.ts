import { Injectable } from '@nestjs/common';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsISO31661Alpha2,
} from 'class-validator';

@Injectable()
export class LeadCreate {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  firstName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  lastName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsISO31661Alpha2()
  country: string;
}

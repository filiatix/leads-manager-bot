import { Injectable } from '@nestjs/common';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
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
  @IsString()
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
  countryId: string;
}

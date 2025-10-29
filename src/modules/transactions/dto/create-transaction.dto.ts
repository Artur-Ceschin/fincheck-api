import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsNumber,
  IsString,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { TransactionType } from '../entities/transaction';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  bankAccountId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  value: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsNotEmpty()
  @IsDateString()
  date: string;
}

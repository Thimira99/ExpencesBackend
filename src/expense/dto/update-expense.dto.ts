import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../../user/schemas/user.schema';

export class UpdateExpenseDto {
  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly date: Date;

  @IsOptional()
  @IsNumber()
  readonly amount: number;

  @IsOptional()
  readonly category: string;
}

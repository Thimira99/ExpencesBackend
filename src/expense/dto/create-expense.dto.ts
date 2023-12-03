import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from '../../user/schemas/user.schema';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly date: Date;

  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @IsNotEmpty()
  readonly category: string;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}

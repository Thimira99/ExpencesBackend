import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Expense {
  @Prop()
  date: Date;

  @Prop()
  category: string;

  @Prop()
  description: string;

  @Prop()
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

import mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';
export declare class Expense {
    date: Date;
    category: string;
    description: string;
    amount: number;
    user: User;
}
export declare const ExpenseSchema: mongoose.Schema<Expense, mongoose.Model<Expense, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Expense>;

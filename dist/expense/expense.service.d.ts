import { Expense } from './schemas/expense.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from '../user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpenseService {
    private expenseModel;
    private userModel;
    constructor(expenseModel: mongoose.Model<Expense>, userModel: UserService);
    findAll(query: Query, user: User): Promise<Expense[]>;
    findById(id: string): Promise<Expense | null>;
    create(expense: Expense, user: User): Promise<Expense>;
    updateById(id: string, updatedExpense: UpdateExpenseDto): Promise<Expense>;
    deleteById(id: string): Promise<Expense>;
    getMaxByCategory(category: string, user: User): Promise<Expense | null>;
    getMinByCategory(category: string, user: User): Promise<Expense | null>;
    getMonthlyAverage(userId: string): Promise<{
        month: string;
        average: number;
    }[]>;
    getDailyAverage(userId: string): Promise<{
        date: string;
        day: string;
        average: number;
    }[]>;
}

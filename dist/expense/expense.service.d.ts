import { Expense } from "./schemas/expense.schema";
import * as mongoose from "mongoose";
import { Query } from "express-serve-static-core";
import { User } from "../user/schemas/user.schema";
import { UserService } from "src/user/user.service";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
export declare class ExpenseService {
    private expenseModel;
    private userModel;
    constructor(expenseModel: mongoose.Model<Expense>, userModel: UserService);
    private getMonthIndex;
    findAll(query: Query, user: User): Promise<Expense[]>;
    findById(id: string): Promise<Expense | null>;
    create(expense: Expense, user: User): Promise<Expense>;
    updateById(id: string, updatedExpense: UpdateExpenseDto): Promise<Expense>;
    deleteById(id: string): Promise<Expense>;
    getFilteredValues(user: User, query: Query): Promise<{
        [key: string]: number;
    }>;
    getMonthlyValues(user: User, query: Query): Promise<{
        [key: string]: number;
    }>;
}

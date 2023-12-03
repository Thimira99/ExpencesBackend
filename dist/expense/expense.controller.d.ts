import { ExpenseService } from './expense.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Expense } from './schemas/expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpenseController {
    private expenseService;
    constructor(expenseService: ExpenseService);
    getAllExpenses(query: ExpressQuery, req: any): Promise<Expense[]>;
    createExpense(expense: CreateExpenseDto, req: any): Promise<Expense>;
    updateExpense(id: string, updatedExpense: UpdateExpenseDto): Promise<{
        message: string;
    }>;
    getExpenseById(id: string): Promise<Expense>;
    deleteExpense(id: string): Promise<{
        message: string;
    }>;
    getMaxByCategory(category: string, req: any): Promise<Expense | null>;
    getMinByCategory(category: string, req: any): Promise<Expense | null>;
    getMonthlyAverage(req: any): Promise<{
        month: string;
        average: number;
    }[]>;
    getDailyAverage(req: any): Promise<{
        date: string;
        average: number;
    }[]>;
}

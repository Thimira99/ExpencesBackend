import { ExpenseService } from "./expense.service";
import { Query as ExpressQuery } from "express-serve-static-core";
import { Expense } from "./schemas/expense.schema";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
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
    getFilteredValues(query: ExpressQuery, req: any): Promise<{
        [key: string]: number;
    }>;
    getMonthlyValues(query: ExpressQuery, req: any): Promise<{
        [key: string]: number;
    }>;
    getCategoriesYearToDate(query: ExpressQuery, req: any): Promise<{
        [key: string]: number;
    }>;
    getCategoriesMonthToDate(query: ExpressQuery, req: any): Promise<{
        [key: string]: number;
    }>;
}

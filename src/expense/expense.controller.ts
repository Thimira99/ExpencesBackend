import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ExpenseService } from "./expense.service";

import { Query as ExpressQuery } from "express-serve-static-core";
import { Expense } from "./schemas/expense.schema";
import { AuthGuard } from "@nestjs/passport";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";

@Controller("expense")
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getAllExpenses(
    @Query() query: ExpressQuery,
    @Req() req
  ): Promise<Expense[]> {
    return this.expenseService.findAll(query, req.user);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createExpense(
    @Body()
    expense: CreateExpenseDto,
    @Req() req
  ): Promise<Expense> {
    return this.expenseService.create(expense, req.user);
  }

  @Put(":id")
  @UseGuards(AuthGuard())
  async updateExpense(
    @Param("id") id: string,
    @Body() updatedExpense: UpdateExpenseDto
  ): Promise<{ message: string }> {
    try {
      const result = await this.expenseService.updateById(id, updatedExpense);

      if (!result) {
        throw new NotFoundException("Expense not found");
      }

      return { message: "Expense updated successfully" };
    } catch (error) {
      return { message: "Error updating expense" };
    }
  }

  @Get(":id")
  @UseGuards(AuthGuard())
  async getExpenseById(@Param("id") id: string): Promise<Expense> {
    const expense = await this.expenseService.findById(id);
    if (!expense) {
      throw new NotFoundException("Expense not found");
    }
    return expense;
  }

  @Delete(":id")
  @UseGuards(AuthGuard())
  async deleteExpense(@Param("id") id: string): Promise<{ message: string }> {
    try {
      const deletedExpense = await this.expenseService.deleteById(id);

      if (!deletedExpense) {
        return { message: "Expense not found" };
      }

      return { message: "Expense deleted successfully" };
    } catch (error) {
      return { message: "Error deleting expense" };
    }
  }

  @Get("filter/filteredvaluesByDay")
  @UseGuards(AuthGuard())
  async getFilteredValues(
    @Query() query: ExpressQuery,
    @Req() req
  ): Promise<{ [key: string]: number }> {
    const user = req.user;
    return this.expenseService.getDailyValues(user, query);
  }

  @Get("filter/filteredvaluesByMonth")
  @UseGuards(AuthGuard())
  async getMonthlyValues(
    @Query() query: ExpressQuery,
    @Req() req
  ): Promise<{ [key: string]: number }> {
    const user = req.user;

    return this.expenseService.getMonthlyValues(user, query);
  }

  @Get("categories/year-to-date")
  @UseGuards(AuthGuard())
  async getCategoriesYearToDate(@Query() query: ExpressQuery, @Req() req) {
    const user = req.user;

    // Call the service method to get total expenses for categories year-to-date
    const result = await this.expenseService.getCategoriesYearToDate(
      user,
      query
    );
    return result;
  }

  @Get("categories/month-to-date")
  @UseGuards(AuthGuard())
  async getCategoriesMonthToDate(@Query() query: ExpressQuery, @Req() req) {
    const user = req.user;

    // Call the service method to get total expenses for categories from the beginning of the month to the specified date
    const result = await this.expenseService.getCategoriesMonthToDate(
      user,
      query
    );
    return result;
  }
}

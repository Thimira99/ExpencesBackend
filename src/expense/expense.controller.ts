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
} from '@nestjs/common';
import { ExpenseService } from './expense.service';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { Expense } from './schemas/expense.schema';
import { AuthGuard } from '@nestjs/passport';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  // Get
  @Get()
  @UseGuards(AuthGuard())
  async getAllExpenses(
    @Query() query: ExpressQuery,
    @Req() req,
  ): Promise<Expense[]> {
    return this.expenseService.findAll(query, req.user);
  }

  // Post
  @Post()
  @UseGuards(AuthGuard())
  async createExpense(
    @Body()
    expense: CreateExpenseDto,
    @Req() req,
  ): Promise<Expense> {
    return this.expenseService.create(expense, req.user);
  }

  // Update
  @Put(':id')
  @UseGuards(AuthGuard())
  async updateExpense(
    @Param('id') id: string,
    @Body() updatedExpense: UpdateExpenseDto,
  ): Promise<{ message: string }> {
    try {
      console.log(id);
      console.log(updatedExpense);
      const result = await this.expenseService.updateById(id, updatedExpense);

      if (!result) {
        throw new NotFoundException('Expense not found');
      }

      return { message: 'Expense updated successfully' };
    } catch (error) {
      return { message: 'Error updating expense' };
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getExpenseById(@Param('id') id: string): Promise<Expense> {
    const expense = await this.expenseService.findById(id);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  // Delete
  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteExpense(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const deletedExpense = await this.expenseService.deleteById(id);
      console.log(deletedExpense);

      if (!deletedExpense) {
        return { message: 'Expense not found' };
      }

      return { message: 'Expense deleted successfully' };
    } catch (error) {
      return { message: 'Error deleting expense' };
    }
  }

  // Get max by category
  @Get('max/:category')
  @UseGuards(AuthGuard())
  async getMaxByCategory(
    @Param('category') category: string,
    @Req() req,
  ): Promise<Expense | null> {
    const maxExpense = await this.expenseService.getMaxByCategory(
      category,
      req.user,
    );

    if (!maxExpense) {
      throw new NotFoundException(
        'No expenses found for the specified category',
      );
    }

    return maxExpense;
  }

  // Get min by category
  @Get('min/:category')
  @UseGuards(AuthGuard())
  async getMinByCategory(
    @Param('category') category: string,
    @Req() req,
  ): Promise<Expense | null> {
    const minExpense = await this.expenseService.getMinByCategory(
      category,
      req.user,
    );

    if (!minExpense) {
      throw new NotFoundException(
        'No expenses found for the specified category',
      );
    }

    return minExpense;
  }

  // Get monthly average
  @Get('monthly-average')
  @UseGuards(AuthGuard())
  async getMonthlyAverage(
    @Req() req,
  ): Promise<{ month: string; average: number }[]> {
    const userId = req.user._id;
    return this.expenseService.getMonthlyAverage(userId);
  }

  // Get daily average
  @Get('daily-average')
  @UseGuards(AuthGuard())
  async getDailyAverage(
    @Req() req,
  ): Promise<{ date: string; average: number }[]> {
    const userId = req.user._id;
    return this.expenseService.getDailyAverage(userId);
  }
}

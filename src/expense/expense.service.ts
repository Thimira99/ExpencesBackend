import { Injectable, NotFoundException } from '@nestjs/common';
import { Expense } from './schemas/expense.schema';
import { InjectModel } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from '../user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { getDayName, getMonthName } from 'src/utils/dateMonthsName';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name)
    private expenseModel: mongoose.Model<Expense>,
    private userModel: UserService,
  ) {}

  // Find all for the specific user
  async findAll(query: Query, user: User): Promise<Expense[]> {
    const resPerPage = Number(query.perPage);
    let userId = user._id;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    let category = query.category || 'All';

    const avalibale = await this.userModel.getUserCategories(userId);

    category === 'All'
      ? (category = [...avalibale])
      : (category = query.category as string).split(',');

    const queryn = {
      user: userId,
      category: { $in: category },
    };

    const expenses = await this.expenseModel
      .find(queryn)
      .limit(resPerPage)
      .skip(skip);

    console.log(expenses);

    return expenses;
  }

  // Fine by expenseId
  async findById(id: string): Promise<Expense | null> {
    return this.expenseModel.findById(id).exec();
  }

  // Create expenses
  async create(expense: Expense, user: User): Promise<Expense> {
    const data = Object.assign(expense, { user: user._id });
    console.log(data);

    const res = await this.expenseModel.create(data);
    return res;
  }

  // Update expenses by id
  async updateById(
    id: string,
    updatedExpense: UpdateExpenseDto,
  ): Promise<Expense> {
    const existingExpense = await this.expenseModel.findById(id);

    if (!existingExpense) {
      throw new NotFoundException('Expense not found');
    }

    // Assuming updatedExpense is an object with the fields to update
    Object.assign(existingExpense, updatedExpense);

    return await existingExpense.save();
  }

  // Delete expense
  async deleteById(id: string): Promise<Expense> {
    return await this.expenseModel.findByIdAndDelete(id);
  }

  // Get max By Category
  async getMaxByCategory(
    category: string,
    user: User,
  ): Promise<Expense | null> {
    const userId = user._id;

    const query = {
      user: userId,
      category,
    };

    const maxExpense = await this.expenseModel
      .findOne(query)
      .sort({ amount: -1 })
      .exec();

    return maxExpense;
  }

  // Get max By Category
  async getMinByCategory(
    category: string,
    user: User,
  ): Promise<Expense | null> {
    const userId = user._id;

    const query = {
      user: userId,
      category,
    };

    const maxExpense = await this.expenseModel
      .findOne(query)
      .sort({ amount: 1 })
      .exec();

    return maxExpense;
  }

  // Get monthly average
  async getMonthlyAverage(
    userId: string,
  ): Promise<{ month: string; average: number }[]> {
    const monthlyAverage = await this.expenseModel
      .aggregate([
        {
          $match: { user: new mongoose.Types.ObjectId(userId) },
        },
        {
          $group: {
            _id: {
              month: { $month: '$date' }, // Extract month number
            },
            average: { $avg: { $toDouble: '$amount' } },
          },
        },
        {
          $sort: { '_id.month': 1 },
        },
      ])
      .exec();

    return monthlyAverage.map((result) => ({
      month: getMonthName(result._id.month),
      average: result.average,
    }));
  }

  // Get daily average
  async getDailyAverage(
    userId: string,
  ): Promise<{ date: string; day: string; average: number }[]> {
    const dailyAverage = await this.expenseModel
      .aggregate([
        {
          $match: { user: new mongoose.Types.ObjectId(userId) },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
              dayOfWeek: { $dayOfWeek: '$date' },
            },
            average: { $avg: { $toDouble: '$amount' } },
          },
        },
        {
          $sort: { '_id.date': 1 },
        },
      ])
      .exec();

    return dailyAverage.map((result) => ({
      date: result._id.date,
      day: getDayName(result._id.dayOfWeek),
      average: result.average,
    }));
  }
}

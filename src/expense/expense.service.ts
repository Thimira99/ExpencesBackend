import { Injectable, NotFoundException } from "@nestjs/common";
import { Expense } from "./schemas/expense.schema";
import { InjectModel } from "@nestjs/mongoose";

import * as mongoose from "mongoose";
import { Query } from "express-serve-static-core";
import { User } from "../user/schemas/user.schema";
import { UserService } from "src/user/user.service";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { months } from "src/utils/dateMonthsName";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name)
    private expenseModel: mongoose.Model<Expense>,
    private userModel: UserService
  ) {}

  private getMonthIndex(monthName: string): number {
    return months.findIndex((m) => m.toLowerCase() === monthName.toLowerCase());
  }

  // Find all for the specific user
  async findAll(query: Query, user: User): Promise<Expense[]> {
    const resPerPage = Number(query.perPage);
    let userId = user._id;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    let category = query.category || "All";

    const avalibale = await this.userModel.getUserCategories(userId);

    category === "All"
      ? (category = [...avalibale])
      : (category = query.category as string).split(",");

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
    updatedExpense: UpdateExpenseDto
  ): Promise<Expense> {
    const existingExpense = await this.expenseModel.findById(id);

    if (!existingExpense) {
      throw new NotFoundException("Expense not found");
    }

    // Assuming updatedExpense is an object with the fields to update
    Object.assign(existingExpense, updatedExpense);

    return await existingExpense.save();
  }

  // Delete expense
  async deleteById(id: string): Promise<Expense> {
    return await this.expenseModel.findByIdAndDelete(id);
  }

  // Get day values
  async getFilteredValues(
    user: User,
    query: Query
  ): Promise<{ [key: string]: number }> {
    const userId = user._id;
    const calculatedType = query.calculatedType;

    const userCategories = await this.userModel.getUserCategories(userId);

    const filterCategories = async (
      category: string
    ): Promise<{ [key: string]: number }> => {
      const categoryQuery = {
        user: userId,
        category,
        date: query.date,
      };
      const expenses = await this.expenseModel.find(categoryQuery).exec();

      if (!expenses || expenses.length === 0) {
        return { [category]: 0 };
      }

      switch (calculatedType) {
        case "max":
          return {
            [category]: Math.max(...expenses.map((expense) => expense.amount)),
          };
        case "min":
          return {
            [category]: Math.min(...expenses.map((expense) => expense.amount)),
          };
        case "average":
          const totalAmount = expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
          );
          const average = totalAmount / expenses.length;
          return { [category]: average };
        case "total":
          const total = expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
          );
          return { [category]: total };
        default:
          throw new NotFoundException("Invalid calculatedType");
      }
    };

    const results = await Promise.all(userCategories.map(filterCategories));

    // Merge the individual results into a single object
    const mergedResults = results.reduce(
      (acc, result) => ({ ...acc, ...result }),
      {}
    );

    return mergedResults;
  }

  // Get Monthly values
  async getMonthlyValues(
    user: User,
    query: Query
  ): Promise<{ [key: string]: number }> {
    const userId = user._id;
    const monthName = query.month as string;
    const calculatedType = query.calculatedType;

    const userCategories = await this.userModel.getUserCategories(userId);

    const filterCategories = async (
      category: string
    ): Promise<{ [key: string]: number }> => {
      const monthIndex = this.getMonthIndex(monthName);

      if (monthIndex === -1) {
        throw new NotFoundException("Invalid month name");
      }

      const query = {
        user: userId,
        category,
        date: {
          $gte: new Date(new Date().getFullYear(), monthIndex, 1),
          $lt: new Date(new Date().getFullYear(), monthIndex + 1, 1),
        },
      };

      const expenses = await this.expenseModel.find(query).exec();

      if (!expenses || expenses.length === 0) {
        return { [category]: 0 };
      }

      switch (calculatedType) {
        case "max":
          return {
            [category]: Math.max(...expenses.map((expense) => expense.amount)),
          };
        case "average":
          const totalAmount = expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
          );
          const average = totalAmount / expenses.length;
          return { [category]: average };
        case "total":
          const total = expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
          );
          return { [category]: total };
        default:
          throw new NotFoundException("Invalid calculatedType");
      }
    };

    const results = await Promise.all(userCategories.map(filterCategories));

    // Merge the individual results into a single object
    const mergedResults = results.reduce(
      (acc, result) => ({ ...acc, ...result }),
      {}
    );

    return mergedResults;
  }
}

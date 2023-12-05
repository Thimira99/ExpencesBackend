"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const expense_schema_1 = require("./schemas/expense.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const user_service_1 = require("../user/user.service");
const dateMonthsName_1 = require("../utils/dateMonthsName");
let ExpenseService = class ExpenseService {
    constructor(expenseModel, userModel) {
        this.expenseModel = expenseModel;
        this.userModel = userModel;
    }
    getMonthIndex(monthName) {
        return dateMonthsName_1.months.findIndex((m) => m.toLowerCase() === monthName.toLowerCase());
    }
    async findAll(query, user) {
        const resPerPage = Number(query.perPage);
        let userId = user._id;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        let category = query.category || "All";
        const avalibale = await this.userModel.getUserCategories(userId);
        category === "All"
            ? (category = [...avalibale])
            : (category = query.category).split(",");
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
    async findById(id) {
        return this.expenseModel.findById(id).exec();
    }
    async create(expense, user) {
        const data = Object.assign(expense, { user: user._id });
        console.log(data);
        const res = await this.expenseModel.create(data);
        return res;
    }
    async updateById(id, updatedExpense) {
        const existingExpense = await this.expenseModel.findById(id);
        if (!existingExpense) {
            throw new common_1.NotFoundException("Expense not found");
        }
        Object.assign(existingExpense, updatedExpense);
        return await existingExpense.save();
    }
    async deleteById(id) {
        return await this.expenseModel.findByIdAndDelete(id);
    }
    async getFilteredValues(user, query) {
        const userId = user._id;
        const calculatedType = query.calculatedType;
        const userCategories = await this.userModel.getUserCategories(userId);
        const filterCategories = async (category) => {
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
                    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
                    const average = totalAmount / expenses.length;
                    return { [category]: average };
                case "total":
                    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
                    return { [category]: total };
                default:
                    throw new common_1.NotFoundException("Invalid calculatedType");
            }
        };
        const results = await Promise.all(userCategories.map(filterCategories));
        const mergedResults = results.reduce((acc, result) => (Object.assign(Object.assign({}, acc), result)), {});
        return mergedResults;
    }
    async getMonthlyValues(user, query) {
        const userId = user._id;
        const monthName = query.month;
        const calculatedType = query.calculatedType;
        const userCategories = await this.userModel.getUserCategories(userId);
        const filterCategories = async (category) => {
            const monthIndex = this.getMonthIndex(monthName);
            if (monthIndex === -1) {
                throw new common_1.NotFoundException("Invalid month name");
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
                    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
                    const average = totalAmount / expenses.length;
                    return { [category]: average };
                case "total":
                    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
                    return { [category]: total };
                default:
                    throw new common_1.NotFoundException("Invalid calculatedType");
            }
        };
        const results = await Promise.all(userCategories.map(filterCategories));
        const mergedResults = results.reduce((acc, result) => (Object.assign(Object.assign({}, acc), result)), {});
        return mergedResults;
    }
};
ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose.Model, user_service_1.UserService])
], ExpenseService);
exports.ExpenseService = ExpenseService;
//# sourceMappingURL=expense.service.js.map
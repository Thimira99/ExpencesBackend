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
    async findAll(query, user) {
        const resPerPage = Number(query.perPage);
        let userId = user._id;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        let category = query.category || 'All';
        const avalibale = await this.userModel.getUserCategories(userId);
        category === 'All'
            ? (category = [...avalibale])
            : (category = query.category).split(',');
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
            throw new common_1.NotFoundException('Expense not found');
        }
        Object.assign(existingExpense, updatedExpense);
        return await existingExpense.save();
    }
    async deleteById(id) {
        return await this.expenseModel.findByIdAndDelete(id);
    }
    async getMaxByCategory(category, user) {
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
    async getMinByCategory(category, user) {
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
    async getMonthlyAverage(userId) {
        const monthlyAverage = await this.expenseModel
            .aggregate([
            {
                $match: { user: new mongoose.Types.ObjectId(userId) },
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
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
            month: (0, dateMonthsName_1.getMonthName)(result._id.month),
            average: result.average,
        }));
    }
    async getDailyAverage(userId) {
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
            day: (0, dateMonthsName_1.getDayName)(result._id.dayOfWeek),
            average: result.average,
        }));
    }
};
ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose.Model, user_service_1.UserService])
], ExpenseService);
exports.ExpenseService = ExpenseService;
//# sourceMappingURL=expense.service.js.map
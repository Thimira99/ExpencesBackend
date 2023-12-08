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
exports.ExpenseController = void 0;
const common_1 = require("@nestjs/common");
const expense_service_1 = require("./expense.service");
const passport_1 = require("@nestjs/passport");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const update_expense_dto_1 = require("./dto/update-expense.dto");
let ExpenseController = class ExpenseController {
    constructor(expenseService) {
        this.expenseService = expenseService;
    }
    async getAllExpenses(query, req) {
        return this.expenseService.findAll(query, req.user);
    }
    async createExpense(expense, req) {
        return this.expenseService.create(expense, req.user);
    }
    async updateExpense(id, updatedExpense) {
        try {
            const result = await this.expenseService.updateById(id, updatedExpense);
            if (!result) {
                throw new common_1.NotFoundException("Expense not found");
            }
            return { message: "Expense updated successfully" };
        }
        catch (error) {
            return { message: "Error updating expense" };
        }
    }
    async getExpenseById(id) {
        const expense = await this.expenseService.findById(id);
        if (!expense) {
            throw new common_1.NotFoundException("Expense not found");
        }
        return expense;
    }
    async deleteExpense(id) {
        try {
            const deletedExpense = await this.expenseService.deleteById(id);
            if (!deletedExpense) {
                return { message: "Expense not found" };
            }
            return { message: "Expense deleted successfully" };
        }
        catch (error) {
            return { message: "Error deleting expense" };
        }
    }
    async getFilteredValues(query, req) {
        const user = req.user;
        return this.expenseService.getDailyValues(user, query);
    }
    async getMonthlyValues(query, req) {
        const user = req.user;
        return this.expenseService.getMonthlyValues(user, query);
    }
    async getCategoriesYearToDate(query, req) {
        const user = req.user;
        const result = await this.expenseService.getCategoriesYearToDate(user, query);
        return result;
    }
    async getCategoriesMonthToDate(query, req) {
        const user = req.user;
        const result = await this.expenseService.getCategoriesMonthToDate(user, query);
        return result;
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getAllExpenses", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expense_dto_1.CreateExpenseDto, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_expense_dto_1.UpdateExpenseDto]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getExpenseById", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "deleteExpense", null);
__decorate([
    (0, common_1.Get)("filter/filteredvaluesByDay"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getFilteredValues", null);
__decorate([
    (0, common_1.Get)("filter/filteredvaluesByMonth"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getMonthlyValues", null);
__decorate([
    (0, common_1.Get)("categories/year-to-date"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getCategoriesYearToDate", null);
__decorate([
    (0, common_1.Get)("categories/month-to-date"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getCategoriesMonthToDate", null);
ExpenseController = __decorate([
    (0, common_1.Controller)("expense"),
    __metadata("design:paramtypes", [expense_service_1.ExpenseService])
], ExpenseController);
exports.ExpenseController = ExpenseController;
//# sourceMappingURL=expense.controller.js.map
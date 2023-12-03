"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseModule = void 0;
const common_1 = require("@nestjs/common");
const expense_service_1 = require("./expense.service");
const user_module_1 = require("../user/user.module");
const mongoose_1 = require("@nestjs/mongoose");
const expense_controller_1 = require("./expense.controller");
const expense_schema_1 = require("./schemas/expense.schema");
let ExpenseModule = class ExpenseModule {
};
ExpenseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'Expense', schema: expense_schema_1.ExpenseSchema }]),
        ],
        controllers: [expense_controller_1.ExpenseController],
        providers: [expense_service_1.ExpenseService],
    })
], ExpenseModule);
exports.ExpenseModule = ExpenseModule;
//# sourceMappingURL=expense.module.js.map
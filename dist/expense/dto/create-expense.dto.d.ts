import { User } from '../../user/schemas/user.schema';
export declare class CreateExpenseDto {
    readonly description: string;
    readonly date: Date;
    readonly amount: number;
    readonly category: string;
    readonly user: User;
}

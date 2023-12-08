import { UserService } from "./user.service";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";
import { User } from "./schemas/user.schema";
import { CategoryDto } from "./dto/category.dto";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    signUp(signUpDto: SignUpDto): Promise<{
        user: User;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
    getUserCategories(req: any): Promise<string[]>;
    updateUserCategories(req: any, updateCategoriesDto: CategoryDto): Promise<string[]>;
}

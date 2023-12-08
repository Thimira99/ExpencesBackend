import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { CategoryDto } from "./dto/category.dto";
export declare class UserService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        user: User;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
    getUserCategories(user: User): Promise<string[]>;
    addUserCategories(user: User, updateCategoriesDto: CategoryDto): Promise<string[]>;
}

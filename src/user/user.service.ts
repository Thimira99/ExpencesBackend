import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";

import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { CategoryDto } from "./dto/category.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  // Signup
  async signUp(signUpDto: SignUpDto): Promise<{ user: User }> {
    const { name, email, password } = signUpDto;

    // Check if the email already exists
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new UnauthorizedException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user if the email doesn't exist
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return { user };
  }

  // Login
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException("Invalid email");
    }

    // Check the password is match
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException("Invalid password");
    }
    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
      name: user.name,
    });

    return { token };
  }

  // Get categories by user id
  async getUserCategories(user: User): Promise<string[]> {
    const userId = user._id;
    const userCategories = await this.userModel.findById(userId).exec();

    if (!user) {
      // Handle user not found
      throw new NotFoundException("Categories not found");
    }

    return userCategories.categories;
  }

  // Add categories to the users
  async addUserCategories(
    user: User,
    updateCategoriesDto: CategoryDto
  ): Promise<string[]> {
    // Update user categories logic
    user.categories.push(updateCategoriesDto.category);
    await user.save();
    return user.categories;
  }
}

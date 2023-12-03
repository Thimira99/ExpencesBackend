import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { CategoryDto } from './dto/category.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ user: User }> {
    const { user } = await this.userService.signUp(signUpDto);
    return { user };
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.userService.login(loginDto);
  }

  @Get('/categories')
  @UseGuards(AuthGuard()) // Protect the route with your authentication guard
  async getUserCategories(@Req() req): Promise<string[]> {
    return this.userService.getUserCategories(req.user);
  }

  @Put('/categories')
  @UseGuards(AuthGuard())
  async updateUserCategories(
    @Req() req,
    @Body() updateCategoriesDto: CategoryDto,
  ): Promise<string[]> {
    const updatedUser = await this.userService.addUserCategories(
      req.user,
      updateCategoriesDto,
    );
    return updatedUser;
  }
}

import { UserService } from './user.service';
import { SignupDto } from './dtos/signup.dto';
import { EditUserDto } from './dtos/edit.dto';
import {
  Body,
  Controller,
  Post,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'sign up new user' })
  @Post()
  async signup(@Body() user: SignupDto) {
    return this.userService.createUser(user);
  }

  @ApiOperation({ summary: 'edit current user' })
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Patch()
  async editUser(@Request() req: any, @Body() body: EditUserDto) {
    return this.userService.editUser(req.user.sub, body);
  }
}

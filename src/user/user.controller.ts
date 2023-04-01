import { UserService } from './user.service';
import { SignupDto } from './dtos/signup.dto';
import { EditDto } from './dtos/edit.dto';
import {
  Body,
  Controller,
  Post,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async signup(@Body() user: SignupDto) {
    return this.userService.createUser(user);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async editUser(@Request() req: any, @Body() body: EditDto) {
    return this.userService.editUser(req.user.sub, body);
  }
}

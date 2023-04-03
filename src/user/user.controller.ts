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
import { FollowDto } from './dtos/follow.dto';

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

  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Post('follow')
  async followUser(@Request() req: any, @Body() body: FollowDto) {
    return this.userService.followUser(req.user.sub, body);
  }

  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Post('unfollow')
  async unfollowUser(@Request() req: any, @Body() body: FollowDto) {
    return this.userService.unfollowUser(req.user.sub, body);
  }
}

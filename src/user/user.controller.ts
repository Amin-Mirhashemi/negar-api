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
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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

  @ApiOperation({ summary: 'current user data' })
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Get()
  async getCurrentUser(@Request() req: any) {
    return this.userService.getUser(req.user.sub);
  }

  // @Get('id/:id')
  // @ApiParam({ name: 'id', required: true })
  // @ApiHeader({ name: 'Authorization', required: true })
  // @UseGuards(AuthGuard)
  // async getUser(@Request() req: any, @Param() params: any) {
  //   return this.userService.getUser(params.id, req.user.sub);
  // }

  // @Get('username/:username')
  // @ApiParam({ name: 'username', required: true })
  // async getUserByUsername(@Param() params: any) {
  //   return this.userService.getUserByUsername(params.username);
  // }

  // @ApiHeader({ name: 'Authorization', required: true })
  // @UseGuards(AuthGuard)
  // @Post('follow')
  // async followUser(@Request() req: any, @Body() body: FollowDto) {
  //   return this.userService.followUser(req.user.sub, body);
  // }

  // @ApiHeader({ name: 'Authorization', required: true })
  // @UseGuards(AuthGuard)
  // @Post('unfollow')
  // async unfollowUser(@Request() req: any, @Body() body: FollowDto) {
  //   return this.userService.unfollowUser(req.user.sub, body);
  // }

  // @ApiOperation({ summary: 'current user followers' })
  // @ApiHeader({ name: 'Authorization', required: true })
  // @UseGuards(AuthGuard)
  // @Get('followers')
  // async getCurrentUserFollowers(@Request() req: any) {
  //   return this.userService.getFollowers(req.user.sub);
  // }

  // @Get(':id/followers')
  // @ApiParam({ name: 'id', required: true })
  // async getFollowers(@Param() params: any) {
  //   return this.userService.getFollowers(params.id);
  // }

  // @ApiOperation({ summary: 'current user followings' })
  // @ApiHeader({ name: 'Authorization', required: true })
  // @UseGuards(AuthGuard)
  // @Get('followings')
  // async getCurrentUserFollowings(@Request() req: any) {
  //   return this.userService.getFollowings(req.user.sub);
  // }

  // @Get(':id/followings')
  // @ApiParam({ name: 'id', required: true })
  // async getFollowings(@Param() params: any) {
  //   return this.userService.getFollowings(params.id);
  // }
}

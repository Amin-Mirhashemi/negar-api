import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { FeedService } from './feed.service';

@ApiTags('Feed')
@Controller()
export class FeedController {
  constructor(private feedService: FeedService) {}

  @ApiHeader({ name: 'Authorization', required: true })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @UseGuards(AuthGuard)
  @Get('feed')
  async feed(
    @Request() req: any,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
  ) {
    return this.feedService.getFeed(req.user.sub, offset, limit);
  }

  @ApiHeader({ name: 'Authorization', required: true })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @UseGuards(AuthGuard)
  @Get('explore')
  async explore(
    @Request() req: any,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('search') search: string,
  ) {
    return this.feedService.getExplore(req.user.sub, offset, limit, search);
  }

  @ApiHeader({ name: 'Authorization', required: true })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiParam({ name: 'id', required: true })
  @UseGuards(AuthGuard)
  @Get('reposts/:id')
  async reposts(
    @Request() req: any,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Param('id') id: string,
  ) {
    return this.feedService.getReposts(req.user.sub, offset, limit, id);
  }

  @ApiHeader({ name: 'Authorization', required: true })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiParam({ name: 'userId', required: true })
  @UseGuards(AuthGuard)
  @Get('posts/:userId')
  async userPosts(
    @Request() req: any,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Param('userId') userId: string,
  ) {
    return this.feedService.getUserPosts(req.user.sub, offset, limit, userId);
  }
}

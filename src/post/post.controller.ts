import { PostService } from './post.service';
import { CreatePostDto } from './dtos/createPost.dto';
import { EditPostDto } from './dtos/editPost.dto';
import { CreateCommentDto } from './dtos/createComment.dto';
import { EditCommentDto } from './dtos/editComment.dto';
import {
  Body,
  Controller,
  Post,
  Patch,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LikeDto } from './dtos/like.dto';
import { CreateTagDto } from './dtos/createTag.dto';
import { VoteDto } from './dtos/vote.dto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @ApiOperation({ summary: 'create new post' })
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Post()
  async createPost(@Request() req: any, @Body() body: CreatePostDto) {
    return this.postService.createPost(body, req.user.sub);
  }

  @ApiOperation({ summary: 'edit post' })
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Patch()
  async editPost(@Request() req: any, @Body() body: EditPostDto) {
    return this.postService.editPost(body, req.user.sub);
  }

  @ApiOperation({ summary: 'delete post' })
  @ApiParam({ name: 'id', required: true })
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(@Request() req: any, @Param() params: any) {
    return this.postService.deletePost(params.id, req.user.sub);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  async getPost(@Request() req: any, @Param() params: any) {
    return this.postService.getPost(params.id, req.user.sub);
  }

  @Get(':id/comments')
  @ApiParam({ name: 'id', required: true })
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  async getComments(@Request() req: any, @Param() params: any) {
    return this.postService.getComments(params.id, req.user.sub);
  }
}

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private postService: PostService) {}

  @ApiOperation({ summary: 'create new comment' })
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Post()
  async createComment(@Request() req: any, @Body() body: CreateCommentDto) {
    return this.postService.createComment(body, req.user.sub);
  }

  @ApiOperation({ summary: 'edit comment' })
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Patch()
  async editComment(@Request() req: any, @Body() body: EditCommentDto) {
    return this.postService.editComment(body, req.user.sub);
  }

  @ApiOperation({ summary: 'delete comment' })
  @ApiParam({ name: 'id', required: true })
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteComment(@Request() req: any, @Param() params: any) {
    return this.postService.deleteComment(params.id, req.user.sub);
  }
}

@ApiTags('Like')
@Controller()
export class LikeController {
  constructor(private postService: PostService) {}

  @ApiOperation({ summary: 'like a comment or post' })
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Post('like')
  async like(@Request() req: any, @Body() body: LikeDto) {
    return this.postService.like(body, req.user.sub);
  }

  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Post('unlike')
  async unlike(@Request() req: any, @Body() body: LikeDto) {
    return this.postService.unlike(body, req.user.sub);
  }
}

@ApiTags('Tags and Vote')
@Controller()
export class VoteController {
  constructor(private postService: PostService) {}

  // @Post('tag')
  // async createTag(@Body() body: CreateTagDto) {
  //   return this.postService.createTag(body.label, body.title);
  // }

  @Get('tags')
  async getTags() {
    return this.postService.getTags();
  }

  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Post('vote')
  async vote(@Request() req: any, @Body() body: VoteDto) {
    return this.postService.vote(req.user.sub, body);
  }

  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @Post('unvote')
  async unvote(@Request() req: any, @Body() body: VoteDto) {
    return this.postService.unvote(req.user.sub, body);
  }
}

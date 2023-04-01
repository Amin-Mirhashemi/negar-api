import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    const isPasswordCorrect = user
      ? await bcrypt.compare(pass, user.password)
      : false;
    if (!isPasswordCorrect || !user) {
      throw new UnauthorizedException('username or password is incorrect');
    }
    const payload = { sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

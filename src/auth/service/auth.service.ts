import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/features/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    name: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.findForAuth(name);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: user._id, name: user.name };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}

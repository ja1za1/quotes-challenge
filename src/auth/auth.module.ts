import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/features/user/user.module';
import { jwtConstants } from './constants';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2m' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './strategies/intra.strategy';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PartiesModule } from '../parties/parties.module';
import { AvailableChanModule } from '../available-chan/available-chan.module';
import { ChanModule } from '../chans/chan.module';
import { ChatModule } from '../chat/chat.module';
//import { UserService } from '../user/user.service';
//import { TypeOrmModule } from '@nestjs/typeorm';
//import UserEntity from '../user/entities/user-entity';
//import { SessionSerializer } from './utils/serializer';
//import { SessionEntity } from './entities/session-entity';
//import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    PartiesModule,
    AvailableChanModule,
    ChanModule,
    ChatModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
      property: 'user',
    }),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET_KEY}`,
      signOptions: {
        expiresIn: `${process.env.JWT_EXPIRATION}`,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

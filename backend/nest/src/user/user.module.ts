import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user-entity';
import { HistoryEntity } from '../parties/entities/history-entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    JwtModule,
    PassportModule,
    TypeOrmModule.forFeature([UserEntity, HistoryEntity]),
  ],
  providers: [UserService, AuthService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

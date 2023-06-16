import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Chat } from "./entities/chat.entity";
import { ChanModule } from '../chans/chan.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "../auth/auth.service";

@Module({
  imports: [
    UserModule,
    JwtModule,
    PassportModule,
    ChanModule,
    UserModule,
    TypeOrmModule.forFeature([Chat]),
  ],
  providers: [ChatService, ChatGateway, AuthService],
})
export class ChatModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { configService } from './config/config.service';
import { ChatModule } from './chat/chat.module';
import { PartiesModule } from './parties/parties.module';
import { ChanModule } from './chans/chan.module';
import { AuthModule } from './auth/auth.module';
import { UserAuthGuard } from './auth/guards/user-auth.guard';
import { GameModule } from './game/game.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UpdateModule } from './update/update.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    ChatModule,
    PartiesModule,
    ChanModule,
    AuthModule,
    GameModule,
    UpdateModule,
    ScheduleModule.forRoot()
  ],
  providers: [UserAuthGuard],
})
export class AppModule {}

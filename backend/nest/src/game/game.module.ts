import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ChatService } from './chat.service';
// import { ChatController } from './chat.controller';
import { GameGateway } from './game.gateway';
// import { Chat } from "./entities/chat.entity";
// import { ChanService } from '../chans/chan.service';
// import { ChanModule } from '../chans/chan.module';
import { UserModule } from '../user/user.module';
import { GameService } from './game.service';
import { PartiesModule } from '../parties/parties.module';

@Module({
  imports: [ UserModule, PartiesModule ],
  controllers: [],
  providers: [GameGateway, GameService],
})
export class GameModule {}

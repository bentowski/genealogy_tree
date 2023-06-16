import { Module } from '@nestjs/common';
import { UpdateGateway } from './update.gateway';
import { UserModule } from '../user/user.module';
import { PartiesModule } from '../parties/parties.module';

@Module({
  imports: [ UserModule, PartiesModule ],
  providers: [UpdateGateway],
})
export class UpdateModule {}

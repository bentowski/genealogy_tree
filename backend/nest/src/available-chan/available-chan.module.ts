import { Module } from '@nestjs/common';
import { AvailableChanController } from './available-chan.controller';
import { AvailableChanService } from './available-chan.service';
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {AuthService} from "../auth/auth.service";
import {UserModule} from "../user/user.module";

@Module({
  imports: [JwtModule, PassportModule, UserModule],
  controllers: [AvailableChanController],
  providers: [AvailableChanService, AuthService]
})
export class AvailableChanModule {}

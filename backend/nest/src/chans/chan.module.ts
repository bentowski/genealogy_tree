import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChanService } from './chan.service';
import { ChanController } from './chan.controller';
import { ChanEntity } from "./entities/chan-entity";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {AuthService} from "../auth/auth.service";
import {UserModule} from "../user/user.module";

@Module({
    imports: [ UserModule,
        JwtModule,
        PassportModule,
        TypeOrmModule.forFeature([ChanEntity]) ],
    providers: [ ChanService, AuthService ],
    controllers: [ ChanController ],
    exports: [ TypeOrmModule, ChanService]
})
export class ChanModule {}

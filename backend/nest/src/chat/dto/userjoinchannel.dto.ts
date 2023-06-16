import ChanEntity from "../../chans/entities/chan-entity";
import {IsNotEmpty, IsString} from "class-validator";

export class UserJoinChannelReceiveDto {
    @IsNotEmpty()
    chan: ChanEntity;

    @IsString()
    @IsNotEmpty()
    auth_id: string;
}

export class UserJoinChannelSendDto {
    @IsNotEmpty()
    chan: ChanEntity;

    @IsString()
    @IsNotEmpty()
    userid: string;
}
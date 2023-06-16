import {IsNotEmpty, IsString} from "class-validator";
import ChanEntity from "../../chans/entities/chan-entity";

export class LeaveRoomReceiveDto {
    @IsNotEmpty()
    @IsString()
    room: string;

    @IsNotEmpty()
    @IsString()
    auth_id: string;
}

export class LeaveRoomSendDto {
    @IsNotEmpty()
    @IsString()
    userid: string;

    @IsNotEmpty()
    chan: ChanEntity;
}
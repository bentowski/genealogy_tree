import {IsBoolean, IsNotEmpty, IsString} from "class-validator";

export class MuteToChannelReceiveDto {
    @IsNotEmpty()
    @IsString()
    room: string;

    @IsNotEmpty()
    @IsString()
    auth_id: string;

    @IsNotEmpty()
    @IsBoolean()
    action: boolean;
}

export class MuteToChannelSendDto {
    @IsNotEmpty()
    @IsString()
    room: string;

    @IsString()
    @IsNotEmpty()
    auth_id: string;

    @IsNotEmpty()
    @IsString()
    action: boolean;
}

export class TimerOutMuteDto {
    @IsNotEmpty()
    @IsString()
    auth_id: string;

    @IsNotEmpty()
    @IsString()
    room: string;
}
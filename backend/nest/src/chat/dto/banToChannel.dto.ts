import {IsBoolean, IsNotEmpty, IsString} from "class-validator";

export class BanToChannelReceiveDto {
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

export class BanToChannelSendDto {
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

export class TimerOutBanDto {
    @IsNotEmpty()
    @IsString()
    auth_id: string;
    @IsNotEmpty()
    @IsString()
    room: string;
}
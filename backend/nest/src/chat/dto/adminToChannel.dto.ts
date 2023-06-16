import {IsBoolean, IsNotEmpty, IsString} from "class-validator";

export class AdminToChannelReceiveDto {
    @IsNotEmpty()
    @IsString()
    room: string;

    @IsNotEmpty()
    @IsString()
    auth_id: string;

    @IsNotEmpty()
    @IsString()
    action: boolean;
}

export class AdminToChannelSendDto {
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
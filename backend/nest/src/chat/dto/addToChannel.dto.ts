import {IsNotEmpty, IsString} from "class-validator";
export class AddToChannelReceiveDto {
    @IsNotEmpty()
    @IsString()
    room: string;

    @IsNotEmpty()
    @IsString()
    auth_id: string;
}

export class AddToChannelSendDto {

}
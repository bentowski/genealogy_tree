import {IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";

export class NewMessageReceiveDto {

}

export class NewMessageSendDto {
    @IsNotEmpty()
    @IsString()
    msg: string;

    @IsNotEmpty()
    @MaxLength(150)
    @MinLength(1)
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    sender_socket_id: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    avatar: string;

    @IsNotEmpty()
    @IsString()
    auth_id: string;

    @IsNotEmpty()
    @IsString()
    room: string;
}
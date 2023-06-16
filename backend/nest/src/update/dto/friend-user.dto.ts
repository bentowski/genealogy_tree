import {IsBoolean, IsNotEmpty, IsString} from "class-validator";
import UserEntity from "../../user/entities/user-entity";

export class FriendUserReceiveDto {
    @IsNotEmpty()
    @IsString()
    curid: string;

    @IsNotEmpty()
    @IsString()
    frid: string;

    @IsNotEmpty()
    @IsBoolean()
    action: boolean;
}

export class FriendUserSendDto {
    @IsNotEmpty()
    curuser: UserEntity;
    @IsNotEmpty()
    friuser: UserEntity;
    @IsNotEmpty()
    @IsBoolean()
    action: boolean;
}
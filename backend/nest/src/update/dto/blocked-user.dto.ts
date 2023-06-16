import {IsBoolean, IsNotEmpty, IsString} from "class-validator";
import UserEntity from "../../user/entities/user-entity";

export class BlockedUserReceiveDto {
    @IsNotEmpty()
    @IsString()
    curid: string;
    @IsNotEmpty()
    @IsString()
    bloid: string;

    @IsNotEmpty()
    @IsBoolean()
    action: boolean;
}

export class BlockedUserSendDto {
    @IsNotEmpty()
    user: UserEntity;

    @IsNotEmpty()
    @IsBoolean()
    action: boolean;
}
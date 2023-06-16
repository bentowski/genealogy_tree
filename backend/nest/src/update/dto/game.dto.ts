import {IsNotEmpty, IsString} from "class-validator";

export class SendGameInfoDto {
    @IsNotEmpty()
    @IsString()
    to: string;

    @IsNotEmpty()
    @IsString()
    from: string;

    @IsString()
    partyId?: string;
}
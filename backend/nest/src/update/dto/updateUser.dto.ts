import {IsNotEmpty, IsNumber} from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty()
    @IsNumber()
    auth_id: number;

    @IsNotEmpty()
    @IsNumber()
    status: number;
}

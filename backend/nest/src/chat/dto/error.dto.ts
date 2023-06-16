import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class ErrorDto {
    @IsNotEmpty()
    @IsNumber()
    statusCode: number;

    @IsNotEmpty()
    @IsString()
    message: string;
}
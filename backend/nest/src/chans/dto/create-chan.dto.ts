import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';

export class CreateChanDto {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    owner: string;

    password: string;
}

export class CreatePrivChanDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    @MinLength(2)
    @MaxLength(10)
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsString()
    user_1_id: string;

    @IsNotEmpty()
    @IsString()
    user_2_id: string;
}

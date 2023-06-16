import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class CreatePartiesDto {

    // @IsNumber()
    // public id: number;

    @IsString()
    @IsNotEmpty()
    public login: string;

    @IsNumber()
    @IsNotEmpty()
    public nbplayer: number;

    @IsNumber()
    @IsNotEmpty()
    public type: number;

    @IsNumber()
    @IsNotEmpty()
    public vitesse: number;
}

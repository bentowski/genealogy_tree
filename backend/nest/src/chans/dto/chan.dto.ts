import {IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";

export class ChanPasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  @IsString()
  pass: string;
}
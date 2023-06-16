import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class HistorySavePartiesDto {
  @IsNotEmpty()
  @IsString()
  public user_one_id: string;

  @IsNotEmpty()
  @IsString()
  public user_two_id: string;

  @IsNumber()
  @IsNumber()
  score_one: number;

  @IsNotEmpty()
  @IsNumber()
  score_two: number;

}

import { IsOptional, IsString } from 'class-validator';

export class TwoFACodeDto {
  @IsString()
  @IsOptional()
  twoFACode?: string;
}

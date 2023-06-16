import {IsAlphanumeric, IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength} from 'class-validator';
import UserEntity from '../entities/user-entity';

export class UpdateUserDto {
  @MinLength(3)
  @MaxLength(10)
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @IsString()
  avatar: string;

  @IsString()
  twoFASecret: string;

  @IsNumber()
  isTwoFA: number;
}

export class UpdateUsernameDto {
  @MinLength(3)
  @MaxLength(10)
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;
}

export class UpdateAvatarDto {
  @IsNotEmpty()
  avatar: string;
}

export class UpdateFriendsDto {
  @IsNotEmpty()
  @IsBoolean()
  action: boolean;

  @IsNotEmpty()
  @IsString()
  auth_id: string;
}

export class BlockedUserDto {
  @IsNotEmpty()
  @IsString()
  auth_id: string;

  @IsNotEmpty()
  @IsBoolean()
  action: boolean;
}
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/* create user dto will be received when a user will create a profile,
this will call the post request
 */

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  auth_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'takes username'
  })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

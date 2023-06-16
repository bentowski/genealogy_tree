import { IsInt, IsNumberString} from 'class-validator';

//data sent when requesting user informations

export class DeleteUserDto {
  user_id: string;
}
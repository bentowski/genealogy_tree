/*
import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import UserEntity from '../../user/entities/user-entity';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: UserEntity) => void) {
    console.log('Serialize User');
    done(null, user);
  }

  async deserializeUser(
    user: UserEntity,
    done: (err: Error, user: UserEntity) => void,
  ) {
    console.log('Deserialize User');
    const userDb = await this.authService.findUser(user.auth_id);
    //console.log(userDb);
    return userDb ? done(null, userDb) : done(null, null);
  }
}
*/

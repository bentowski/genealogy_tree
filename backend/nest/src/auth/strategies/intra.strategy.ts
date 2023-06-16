import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import {
  /* Inject, UnauthorizedException, */ Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import UserEntity from '../../user/entities/user-entity';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.API_CLIENT_ID,
      clientSecret: process.env.API_CLIENT_SECRET,
      callbackURL: "http://cousinade-baudry.fr",
      // process.env.API_CALLBACK_URL,
      scope: ['public'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, username } = profile;
    const user = {
      auth_id: id,
      username: username,
      email: profile['emails'][0]['value'],
    };
    //console.log('lets go in this funciton');
    const newUser: UserEntity = await this.authService.validateUser(user);
    //console.log('welcome buddy');
    return newUser;
  }
}

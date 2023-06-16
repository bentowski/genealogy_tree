import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import UserEntity from '../../user/entities/user-entity';
import { PayloadInterface } from '../interfaces/payload.interface';
import { Request } from 'express';
//import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: `${process.env.JWT_SECRET_KEY}`,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies['jwt'];
          //console.log('access toktok = ', token);
          return token;
        },
      ]),
    });
  }

  async validate(payload: PayloadInterface): Promise<UserEntity> {
    /*
    if (done) {
      console.log('error system = ', done);
      throw new UnauthorizedException('no cookie for the pookie');
    }
     */
    const { auth_id } = payload;
    const user: UserEntity = await this.authService.findUser(auth_id);
    //console.log('user from strategy = ', user);
    if (!user) {
      throw new UnauthorizedException('Invalid Token');
    }
    //console.log('useeer = ', user);
    return user;
    /*if (!newUser.isTwoFA) {
      return newUser;
    }
    if (payload.isAuth) {
      return newUser;
    }*/
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { IntraAuthGuard } from './guards/intra-auth.guard';
import { PayloadInterface } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TwoFACodeDto } from './dto/twofacode.dto';
import { AuthGuard } from '@nestjs/passport';
import UserEntity from '../user/entities/user-entity';
import jwt_decode from 'jwt-decode';
import { UserAuthGuard } from './guards/user-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  @Get('login')
  @UseGuards(IntraAuthGuard)
  login() {
    return;
  }

  @Get('dummyconnect')
  async dummyConnect(@Res() res): Promise<void> {
    let n_id = 1;
    while (await this.authService.findUser(n_id.toString())) {
      n_id++;
    }
    const fakeUser: CreateUserDto = {
      auth_id: n_id.toString(),
      username: 'dummy' + n_id.toString(),
      email: 'dummy@' + n_id.toString() + '.com',
    };
    const newUser: UserEntity = await this.authService.createUser(fakeUser);
    const auth_id: string = newUser.auth_id;
    const isAuth: boolean = false;
    const payload: PayloadInterface = { auth_id, isAuth };
    const access_token: string = this.jwtService.sign(payload);
    try {
      this.authService.changeStatusUser(auth_id, 1);
      res
        .status(202)
        .cookie('jwt', access_token, { httpOnly: true  })
        .redirect('http://cousinade-baudry.fr');
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('redirect')
  @UseGuards(IntraAuthGuard)
  async redirect(
    @Res({ passthrough: true }) res: Response,
    @Req() req,
  ): Promise<void> {
    const auth_id: string = req.user['auth_id'];
    const isAuth: boolean = false;
    const payload: PayloadInterface = { auth_id, isAuth };
    const access_token: string = this.jwtService.sign(payload);
    try {
      this.authService.changeStatusUser(auth_id, 1);
      res
        .status(202)
        .cookie('jwt', access_token, { httpOnly: true })
        .redirect('http://cousinade-baudry.fr');
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('istoken')
  async authenticated(@Req() req, @Res() res): Promise<void> {
    const req_token: string = req.cookies['jwt'];
    if (!req_token) {
      res.status(201).json({ isTok: 0 });
    } else {
      const token: PayloadInterface = jwt_decode(req_token);
      const user: UserEntity = await this.authService.findUser(token.auth_id);
      if (!user) {
        res.status(201).json({ isTok: 1 });
      } else {
        if (user.isTwoFA) {
          if (!token.isAuth) {
            res.status(201).json({ isTok: 2 });
          } else {
            res.status(200).json({ isTok: 3 });
          }
        } else {
          res.status(200).json({ isTok: 4 });
        }
      }
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Delete('logout')
  logout(@Req() req, @Res({ passthrough: true }) res): void {
    try {
      this.authService.changeStatusUser(req.user.auth_id, 0);
      const now: Date = new Date();
      const time: number = now.getTime();
      const exp: number = time + 2000;
      now.setTime(exp);
      res
          .status(200)
          .cookie('jwt', '', { expires: now, httpOnly: true  })
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Post('2fa/generate')
  async register(@Res() response, @Req() req): Promise<any> {
    const auid: string = req.user.auth_id;
    const user: UserEntity = await this.authService.findUser(auid);
    if (!user) {
      throw new NotFoundException(
        'Error while generating 2FA QR Code: Cant find user in database',
      );
    }
    const { otpauthUrl } = await this.authService.generateTwoFASecret(auid);
    return this.authService.pipeQrCodeStream(response, otpauthUrl);
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Post('2fa/activate')
  async turnOnTwoFAAuth(
    @Req() req,
    @Body() obj: TwoFACodeDto,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    const auid: string = req.user.auth_id;
    const isValid: boolean = await this.authService.isTwoFAValid(obj.twoFACode, auid);
    if (!isValid) {
      throw new BadRequestException(
        'Error while activating 2FA: Wrong 2fa code',
      );
    }
    const auth_id: string = req.user.auth_id; //user['auth_id'];
    const isAuth: boolean = true;
    const payload: PayloadInterface = { auth_id, isAuth };
    const access_token: string = this.jwtService.sign(payload);
    try {
      await this.authService.turnOnTwoFAAuth(auid);
      res.status(200).cookie('jwt', access_token, { httpOnly: true  });
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Post('2fa/deactivate')
  async turnOffTwoFAAuth(@Req() req, @Res({ passthrough: true }) res): Promise<void> {
    try {
      await this.authService.turnOffTwoFAAuth(req.user.auth_id);
      res.status(200);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/authenticate')
  async authenticate(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body() obj: TwoFACodeDto,
  ): Promise<void> {
    const auid: string = req.user.auth_id;
    let isValid: boolean = false;
    try {
      isValid = await this.authService.isTwoFAValid(obj.twoFACode, auid);
    } catch (error) {
      throw new Error(error);
    }
    if (!isValid) {
      throw new BadRequestException(
        'Error while authenticating 2FA: Wrong 2FA Code',
      );
    }
    const auth_id: string = req.user.auth_id; //user['auth_id'];
    const isAuth: boolean = true;
    const payload: PayloadInterface = { auth_id, isAuth };
    const access_token: string = this.jwtService.sign(payload);
    res.status(200).cookie('jwt', access_token, { httpOnly: true });
  }
}

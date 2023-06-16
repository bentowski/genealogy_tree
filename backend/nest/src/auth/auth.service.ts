import {Injectable, NotFoundException} from '@nestjs/common';
import { UserService } from '../user/user.service';
import UserEntity from '../user/entities/user-entity';
import { User42Dto } from '../user/dto/user42.dto';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import * as io from 'socket.io-client';
import { CreateUserDto } from '../user/dto/create-user.dto';

const socket = io.connect("http://82.165.70.203:3000/update");

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async createUser(user42: CreateUserDto): Promise<UserEntity> {
    return await this.userService.createUser(user42);
  }

  async validateUser(user42: User42Dto): Promise<UserEntity> {
    try {
      return this.userService.validateUser42(user42);
    } catch (error) {
      throw new Error(error);
    }
  }

  findUser(authId: string): Promise<UserEntity> {
    try {
      return this.userService.findOneByAuthId(authId);
    } catch (error) {
      throw new Error(error);
    }
  }

  checkUser(user): void {
    if (!user) {
      throw new NotFoundException('Error while generating two FA QR Code: Cant find user in database');
    }
  }

  async generateTwoFASecret(auth_id: string) {
    try {
      const user: UserEntity = await this.userService.findOneByAuthId(auth_id);
      this.checkUser(user);
      const secret: string = authenticator.generateSecret();
      const otpauthUrl: string = authenticator.keyuri(
        user.auth_id,
        process.env.TWO_FA_APP_NAME,
        secret,
      );
      await this.userService.setTwoFASecret(secret, user);
      return {
        secret,
        otpauthUrl,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async isTwoFAValid(twoFACode: string, auth_id: string): Promise<boolean> {
    const user: UserEntity = await this.userService.findOneByAuthId(auth_id);
    if (!user) {
      throw new NotFoundException('Error while generating two FA QR Code: Cant find user in database');
    }
    try {
      return authenticator.verify({
        token: twoFACode,
        secret: user.twoFASecret,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async turnOnTwoFAAuth(auth_id: string): Promise<UserEntity> {
    const user: UserEntity = await this.userService.findOneByAuthId(auth_id);
    if (!user) {
      throw new NotFoundException('Error while generating two FA QR Code: Cant find user in database');
    }
    try {
      return await this.userService.turnOnTwoFA(auth_id, user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async turnOffTwoFAAuth(auth_id: string): Promise<void> {
    const user: UserEntity = await this.userService.findOneByAuthId(auth_id);
    if (!user) {
      throw new NotFoundException('Error while generating two FA QR Code: Cant find user in database');
    }
    try {
      await this.userService.turnOffTwoFA(auth_id, user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async changeStatusUser(auth_id: string, status: number): Promise<void> {
    try {
      await this.userService.setStatus(auth_id, status);
      socket.emit('updateUser', { auth_id: auth_id, status: status })
    } catch (error) {
      throw new Error(error);
    }
  }
}

import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import UserEntity from './entities/user-entity';
import { User42Dto } from './dto/user42.dto';
import {
  UpdateUserDto,
  UpdateAvatarDto,
} from './dto/update-user.dto';
import ChanEntity from "../chans/entities/chan-entity";
import * as io from "socket.io-client";

const update = io.connect("http://82.165.70.203:3000/update");


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser42(user42: User42Dto): Promise<UserEntity> {
    let user: UserEntity = await this.findOneByAuthId(user42.auth_id);
    if (!user) {
      try {
        let x = 0;
        while (await this.findOnebyUsername(user42.username)) {
          user42.username = user42.username + x.toString();
          x++;
        }
        user = await this.createUser42(user42);
        return user;
      } catch (error) {
        throw new Error(error);
      }
    }
    return user;
  }

  async currentUser(auth_id: string): Promise<UserEntity> {
    const foundUser: UserEntity = await this.findOneByAuthId(auth_id);
    if (!foundUser) {
      throw new NotFoundException(
        'Error while fetching your data: Failed requesting user in database',
      );
    }
    return foundUser;
  }

  async findOnebyUsername(username?: string): Promise<UserEntity> {
    const findUsername: UserEntity = await this.userRepository.findOne({
      where: { username: username },
      relations: { channelJoined: true, channelBanned: true, channelMuted: true, channelAdmin: true },
    });
    return findUsername;
  }

  async findOneByAuthId(auth_id: string): Promise<UserEntity> {
    const findAuthId: UserEntity = await this.userRepository.findOne({
      where: { auth_id: auth_id },
      relations: { channelJoined: true, channelBanned: true, channelMuted: true, channelAdmin: true },
    });
    return findAuthId;
  }

  async createUser42(user42: User42Dto): Promise<UserEntity> {
    const user: UserEntity = this.userRepository.create(user42);
    user.friends = [];
    user.blocked = [];
    user.channelJoined = [];
    user.channelBanned = [];
    user.channelMuted = [];
    update.emit('userCreation', user);
    try {
      return this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { auth_id, username, email } = createUserDto;
    const user: UserEntity = this.userRepository.create(createUserDto);
    user.auth_id = auth_id;
    user.username = username;
    user.email = email;
    user.friends = [];
    user.blocked = [];
    user.channelJoined = [];
    user.channelBanned = [];
    user.channelMuted = [];
    user.createdAt = new Date();
    update.emit('userCreation', user);
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      const err: string = 'Error while saving user in database: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const users: UserEntity[] = await this.userRepository.find();
    return users;
  }

  async updateUsername(auth_id: string, newUsername: string): Promise<UserEntity> {
    const user: UserEntity = await this.findOneByAuthId(auth_id);
    if (!user) {
      throw new NotFoundException(
        'Error while updating username: Failed requesting user in database',
      );
    }
    const findUser: UserEntity = await this.findOnebyUsername(newUsername);
    if (findUser) {
      throw new BadRequestException(
        'Error while updating username: Username is already taken',
      );
    }
    if (newUsername.length > 10 || newUsername.length < 2) {
      throw new BadRequestException(
        'Error while updating username: Please choose a username between 2 and 30 characters',
      );
    }
    if (!newUsername.match(/^[a-z0-9_]+$/)) {
      throw new BadRequestException(
        'Error while updating username: New username should be alphanumeric',
      );
    }
    user.username = newUsername;
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      const err: string = 'Error while saving user in database: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async updateScore(auth_id: string, isWin: boolean): Promise<UserEntity> {
    const user: UserEntity = await this.findOneByAuthId(auth_id);
    if (!user) {
      throw new NotFoundException(
        'Error while updating username: Failed requesting user in database',
      );
    }
    if (isWin)
      user.game_won = user.game_won + 1;
    else
      user.game_lost = user.game_lost + 1;
    user.total_games = user.total_games + 1;
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      const err: string = 'Error while saving score in database: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async updateAvatar(auth_id: string, updateAvatarDto: UpdateAvatarDto): Promise<UserEntity> {
    const user: UserEntity = await this.findOneByAuthId(auth_id);
    if (!user) {
      throw new NotFoundException(
        'Error while updating avatar: Failed requesting user in database',
      );
    }
    user.avatar = updateAvatarDto.avatar;
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      const err: string = 'Error while saving user in database: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async updateUser(
    authId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user: UserEntity = await this.findOneByAuthId(authId);
    if (!user) {
      throw new NotFoundException(
        'Error while updating user informations: Failed requesting user in database',
      );
    }
    const { username, avatar, twoFASecret, isTwoFA } = updateUserDto;
    if (!username.match(/^[a-z0-9_]+$/)) {
      throw new BadRequestException(
        'Error while updating username: New username should be alphanumeric',
      );
    }
    if (username.length < 2 || username.length > 10) {
      throw new BadRequestException(
        'Error while updating username: New username should be between 2 and 30 characters',
      );
    }
    user.username = username;
    user.avatar = avatar;
    user.twoFASecret = twoFASecret;
    user.isTwoFA = isTwoFA;
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      const err: string = 'Error while updating user informations: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async getFriends(id: string): Promise<UserEntity[]> {
    const user: UserEntity = await this.findOneByAuthId(id);
    if (!user) {
      throw new NotFoundException(
        'Error while getting friends list: Failed requesting user in database',
      );
    }
    const list: UserEntity[] = [];
    for (let index = 0; index < user.friends.length; index++) {
      await this.findOneByAuthId(user.friends[index])
          .then(function (result: UserEntity) {
        list.push(result);
      });
    }
    return list;
  }

  async getBlocked(id: string): Promise<UserEntity[]> {
    const user: UserEntity = await this.findOneByAuthId(id);
    if (!user) {
      throw new NotFoundException(
        'Error while getting blocked users list: Failed requesting user in database',
      );
    }
    const list: UserEntity[] = [];
    for (let index = 0; index < user.blocked.length; index++) {
      await this.findOneByAuthId(user.blocked[index]).then(function (result) {
        list.push(result);
      });
    }
    return list;
  }

  async updateFriends(
    action: boolean,
    current_id: string,
    friend_id: string,
  ): Promise<UserEntity> {
    const curuser: UserEntity = await this.findOneByAuthId(current_id);
    if (!curuser) {
      throw new NotFoundException(
        'Error while updating friends list: Failed requesting user in database',
      );
    }
    const adduser: UserEntity = await this.findOneByAuthId(friend_id);
    if (!adduser) {
      throw new BadRequestException(
        'Error while updating friends list: Failed requesting user in database',
      );
    }
    if (curuser.auth_id === adduser.auth_id) {
      throw new BadRequestException(
        'Error while updating friends list: Users cant (un)friend themselves',
      );
    }
    if (action === true) {
      const found: string = curuser.friends.find((elem) => elem === adduser.auth_id);
      if (found) {
        throw new BadRequestException(
          'Error while updating friends list: User is already in your friend list.',
        );
      }
      curuser.friends.push(adduser.auth_id);
      adduser.friends.push(curuser.auth_id);
    }
    if (action === false) {
      const found: string = curuser.friends.find((elem) => elem === adduser.auth_id);
      if (!found) {
        throw new BadRequestException(
          'Error while updating friends list: User is not in your friend list.',
        );
      }
      const idx_1: number = curuser.friends.indexOf(adduser.auth_id);
      if (idx_1 !== -1) {
        curuser.friends.splice(idx_1, 1);
      }
      const idx_2: number = adduser.friends.indexOf(curuser.auth_id);
      if (idx_2 !== -1) {
        adduser.friends.splice(idx_2, 1);
      }
    }
    try {
      await this.userRepository.save(adduser);
      await this.userRepository.save(curuser);
      return adduser;
    } catch (error) {
      const err: string = 'Error while updating (un)blocked users: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async updateBlocked(
    action: boolean,
    blocked_id: string,
    current_id: string,
  ): Promise<UserEntity> {
    const curuser: UserEntity = await this.findOneByAuthId(current_id);
    if (!curuser) {
      throw new NotFoundException(
        'Error while updating blocked users: Failed requesting (un)blocking user in database',
      );
    }
    const blouser: UserEntity = await this.findOneByAuthId(blocked_id);
    if (!blouser) {
      throw new BadRequestException(
        'Error while updating blocked users: Failed requesting (un)blocked user in database',
      );
    }
    if (curuser.auth_id === blouser.auth_id) {
      throw new BadRequestException(
        'Error while updating blocked users: Users cant (un)block themselves',
      );
    }
    if (action === true) {
      const found: string = curuser.blocked.find((elem) => elem === blouser.auth_id);
      if (found) {
        throw new BadRequestException(
          'Error while updating blocked users: User is already in your blocked list.',
        );
      }
      curuser.blocked.push(blouser.auth_id);
    }
    if (action === false) {
      const found: string = curuser.blocked.find((elem) => elem === blouser.auth_id);
      if (!found) {
        throw new BadRequestException(
          'Error while updating blocked users: User is not in your blocked list.',
        );
      }
      const index: number = curuser.blocked.indexOf(blouser.auth_id);
      if (index !== -1) {
        curuser.blocked.splice(index, 1);
      }
    }
    try {
      await this.userRepository.save(blouser);
      await this.userRepository.save(curuser);
      return blouser;
    } catch (error) {
      const err: string = 'Error while updating (un)blocked users: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async remove(id: string): Promise<void> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { user_id: id },
    });
    if (!user) {
      throw new NotFoundException(
        'Error while removing user: Cant find this user in db',
      );
    }
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async setTwoFASecret(secret: string, user: UserEntity): Promise<UserEntity> {
    try {
      return this.updateUser(user.auth_id, {
        username: user.username,
        avatar: user.avatar,
        twoFASecret: secret,
        isTwoFA: user.isTwoFA,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async turnOnTwoFA(auth_id: string, user: UserEntity): Promise<UserEntity> {
    try {
      return this.updateUser(auth_id, {
        username: user.username,
        avatar: user.avatar,
        twoFASecret: user.twoFASecret,
        isTwoFA: 1,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async turnOffTwoFA(auth_id: string, user: UserEntity): Promise<UserEntity> {
    try {
      return this.updateUser(auth_id, {
        username: user.username,
        avatar: user.avatar,
        twoFASecret: '',
        isTwoFA: 0,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getChannelJoined(auth_id: string): Promise<ChanEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { auth_id: auth_id },
      relations: ['channelJoined'],
    });
    if (!user) {
      throw new NotFoundException(
          'Error while fetching joined chans: Cant find user',
      );
    }
    if (!user.channelJoined) {
      return [];
    }
    return user.channelJoined;
  }


  async getChannelAdmin(auth_id: string): Promise<ChanEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { auth_id: auth_id },
      relations: ['channelAdmin'],
    })
    if (!user) {
      throw new NotFoundException('Error while getting admin user list: Failed requesting user in database');
    }
    if (!user.channelAdmin) {
      return [];
    }
    return user.channelAdmin;
  }

  async getChannelBanned(auth_id: string): Promise<ChanEntity[]> {
      const user: UserEntity = await this.userRepository.findOne({
        where: { auth_id: auth_id},
        relations: ['channelBanned']
      });
      if (!user) {
        throw new NotFoundException(
            'Error while fetching banned chans: Cant find user',
        );
      }
      if (!user.channelBanned) {
        return [];
      }
      return user.channelBanned;
  }

  async getChannelMuted(auth_id: string) {
    const user: UserEntity = await this.userRepository.findOne({
      where: { auth_id: auth_id},
      relations: ['channelMuted']
    });
    if (!user) {
      throw new NotFoundException(
          'Error while fetching muted chans: Cant find user',
      );
    }
    if (!user.channelMuted) {
      return [];
    }
    return user.channelMuted;
  }

  checkFolder(imagename: string): string {
    const fs = require('fs');
    const files = fs.readdirSync('./uploads/profileimages/');
    if (Object.values(files).indexOf(imagename) === -1) {
      imagename = 'default.jpg';
    }
    if (Object.values(files).indexOf(imagename) === -1) {
      const error: string =
        'Error: Couldnt find ' +
        imagename +
        ' , please upload an image on your profile';
      throw new BadRequestException(error);
    }
    return imagename;
  }

  async getAvatar(id: string): Promise<string> {
    const user: UserEntity = await this.findOneByAuthId(id);
    if (!user) {
      throw new NotFoundException(
        'Error while getting avatar: Failed requesting user in database',
      );
    }
    if (!user.avatar) {
      user.avatar = 'default.jpg';
    }
    const imagename: string = user.avatar;
    return imagename;
  }

  async setStatus(auth_id: string, status: number): Promise<void> {
    const user: UserEntity = await this.findOneByAuthId(auth_id);
    if (!user) {
      throw new NotFoundException(
        'Error while setting status of user: Failed requesting user in database',
      );
    }
    if (status == 1 || status == 0) {
      user.status = status;
      try {
        await this.userRepository.save(user);
      } catch (error) {
        const err: string = 'Error while setting status of user: ' + error;
        throw new NotAcceptableException(err);
      }
    } else {
      throw new BadRequestException(
        'Error while setting status of user: Status should be 0 or 1',
      );
    }
  }
}

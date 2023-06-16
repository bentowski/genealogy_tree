import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseIntPipe,
  NotFoundException, Query, BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import {
  UpdateFriendsDto,
  UpdateAvatarDto,
  BlockedUserDto,
  UpdateUsernameDto,
} from './dto/update-user.dto';
import UserEntity from './entities/user-entity';
import { Express } from 'express';
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import ChanEntity from '../chans/entities/chan-entity';
import multer = require("multer");

type validMimeType =  'image/png' | 'image/jpg' | 'image/jpeg' | 'image/gif'

const validMimeTypes: validMimeType [] = [
	'image/png',
	'image/jpg',
	'image/jpeg',
	'image/gif'
]

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req: any, file: any, cb: any) => {
      let filename: string = file.originalname.replace(/\s/g, ''); // + uuidv4();
      const lastDot = filename.lastIndexOf('.');
      filename =
        filename.substring(0, lastDot) + uuidv4() + filename.substring(lastDot);
      cb(null, `${filename}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes: validMimeType[] =  validMimeTypes;
		allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
	},
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get('current')
  async currentUser(@Req() req): Promise<UserEntity> {
    const auid: string = req.user.auth_id;
    try {
      return this.userService.currentUser(auid);
    } catch (error) {
      throw new Error(error);
    }
  }

  //@UseGuards(UserAuthGuard)
  /*
  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  */

  //@UseGuards(UserAuthGuard)
  /*
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.userService.remove(id);
    } catch (error) {
      throw new Error(error);
    }
  }
  */

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('picture', storage))
  async uploadFile(
    @Res({ passthrough: true }) res,
    @Req() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const auid: string = req.user.auth_id;
    const user: UserEntity = await this.userService.findOneByAuthId(auid);
    if (!user) {
      throw new NotFoundException(
        'Error while uploading an image: Failed requesting user in database',
      );
    }
    const newNameAvatar: UpdateAvatarDto = {
      avatar: file.filename,
    };
    try {
      await this.userService.updateAvatar(auid, newNameAvatar);
      return newNameAvatar;
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get('/name/:username')
  async findOnebyUsername(
    @Param('username') username: string,
  ) {
    const user: UserEntity = await this.userService.findOnebyUsername(username);
    if (!user) {
      throw new NotFoundException(
        'Error while fetching database: User with that username doesnt exists',
      );
    }
    return user;
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get('/id/:id')
  async findOnebyID(@Param('id') id: string) {
    const user: UserEntity = await this.userService.findOneByAuthId(id);
    if (!user) {
      throw new NotFoundException(
        'Error while fetching database: User with that id doesnt exists',
      );
    }
    return user;
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get(':id/avatar')
  async getAvatar(
    @Param('id') id: string,
    @Res() res,
  ): Promise<Observable<object>> {
    const user: UserEntity = await this.userService.findOneByAuthId(id);
    if (!user) {
      throw new NotFoundException('Error while fetching avatar from user: User dont exists')
    }
    try {
      let imagename: string = await this.userService.getAvatar(id);
      imagename = this.userService.checkFolder(imagename);
      return of(
        res.sendFile(
          join(process.cwd(), './uploads/profileimages/' + imagename),
        ),
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get(':id/isblocked')
  async isBlocked(@Req() req, @Param('id') id: string): Promise<boolean> {
    try {
      const users: UserEntity[] = await this.userService.getBlocked(
        req.user.auth_id,
      );
      for (let index = 0; index < users.length; index++) {
        if (users[index].auth_id === id) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get(':id/getblocked')
  async getBlocked(@Param('id') id: string): Promise<UserEntity[]> {
    try {
      return this.userService.getBlocked(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get('chan/banned')
  async chanBanned(@Req() req): Promise<ChanEntity[]> {
    try {
      return this.userService.getChannelBanned(req.user.auth_id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get('chan/admin')
  async chanAdmin(@Req() req): Promise<ChanEntity[]> {
    try {
      return this.userService.getChannelAdmin(req.user.auth_id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get('chan/muted')
  async chanMuted(@Req() req): Promise<ChanEntity[]> {
    try {
      return this.userService.getChannelMuted(req.user.auth_id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get('chan/joined')
  async chanPresent(@Req() req): Promise<ChanEntity[]> {
    try {
      return this.userService.getChannelJoined(req.user.auth_id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get(':id/getfriends')
  async getFriends(@Param('id') id: string): Promise<UserEntity[]> {
    try {
      return await this.userService.getFriends(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get(':id/isfriend')
  async isFriend(@Req() req, @Param('id') id: string): Promise<boolean> {
    try {
      const users: UserEntity[] = await this.userService.getFriends(
        req.user.auth_id,
      );
      for (let index = 0; index < users.length; index++) {
        if (users[index].auth_id === id) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Patch('update/friends')
  updateFriends(
    @Req() req,
    @Body() updateFriendsDto: UpdateFriendsDto,
  ): Promise<UserEntity> {
    try {
      return this.userService.updateFriends(
        updateFriendsDto.action,
        req.user.auth_id,
        updateFriendsDto.auth_id,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Patch('update/blocked')
  async updateBlocked(@Req() req, @Body() usr: BlockedUserDto) {
    try {
      return this.userService.updateBlocked(
        usr.action,
        usr.auth_id,
        req.user.auth_id,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Patch('update/username')
  updateUsername(@Req() req, @Body() obj: UpdateUsernameDto): Promise<UserEntity> {
    const auid: string = req.user.auth_id;
    try {
      return this.userService.updateUsername(auid, obj.username);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Patch('update/avatar')
  updateAvatar(@Req() req, @Body() updateAvatarDto: UpdateAvatarDto): Promise<UserEntity> {
    const auid: string = req.user.auth_id;
    try {
      return this.userService.updateAvatar(auid, updateAvatarDto);
    } catch (error) {
      throw new Error(error);
    }
  }
}

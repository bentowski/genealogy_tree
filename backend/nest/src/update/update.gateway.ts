import {NotFoundException, OnModuleInit} from '@nestjs/common';
import {
 SubscribeMessage,
 WebSocketGateway,
 WebSocketServer
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import UserEntity from "../user/entities/user-entity";
import {BlockedUserReceiveDto, BlockedUserSendDto} from "./dto/blocked-user.dto";
import {ErrorDto} from "../chat/dto/error.dto";
import {FriendUserReceiveDto, FriendUserSendDto} from "./dto/friend-user.dto";
import {UpdateUserDto} from "./dto/updateUser.dto";
import {SendGameInfoDto} from "./dto/game.dto";

@WebSocketGateway({
  cors: {
    origin: ['http://cousinade-baudry.fr'],
  },
  namespace: '/update',
})
export class UpdateGateway implements OnModuleInit
{
  constructor(
      private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {});
  }

  @SubscribeMessage('newParty')
  onNewParty(client: Socket) {
	this.server.emit('onNewParty');
  }

  @SubscribeMessage('askForGameUp')
  onAskForGameUp(client: Socket, body: SendGameInfoDto): void {
	  this.server.emit('onAskForGameUp', body);
  }

  @SubscribeMessage('askForGamedown')
  onAskForGameDown(client: Socket, body: SendGameInfoDto): void {
    this.server.emit('onAskForGameDown', body);
  }

  @SubscribeMessage('inviteAccepted')
  onInviteAccepted(client: Socket, body: SendGameInfoDto): void {
	  this.server.emit('onInviteAccepted', body);
  }

  @SubscribeMessage('inviteDeclined')
  onInviteDeclined(client: Socket, body: SendGameInfoDto): void {
	  this.server.emit('onInviteDeclined', body);
  }

  @SubscribeMessage('updateUser')
  onUpdateUser(client: Socket, user: UpdateUserDto): void {
    // if (user.status !== 2)
      // this.userService.setStatus(user.auth_id.toString(), user.status)
  	this.server.emit('onUpdateUser', user);
  }

  @SubscribeMessage('updateFriend')
  async onUpdateFriend(client: Socket, obj: FriendUserReceiveDto) {
    const curuser: UserEntity = await this.userService.findOneByAuthId(obj.curid)
    if (!curuser) {
      throw new NotFoundException('Error while adding friend: Cant find current user')
    }
    try {
      const friuser: UserEntity = await this.userService.updateFriends(obj.action, obj.curid, obj.frid);
      const response: FriendUserSendDto = {
        curuser: curuser,
        friuser: friuser,
        action: obj.action
      }
      this.server.emit('onUpdateFriend', response)
    } catch (error) {
      const err: ErrorDto = {
        statusCode: error.statusCode,
        message: error.message
      }
      this.server.emit('error', err, obj.curid)
    }
  }

  @SubscribeMessage('updateBlocked')
  async onUpdateBlocked(client: Socket, obj: BlockedUserReceiveDto) {
    try {
      const user: UserEntity = await this.userService.updateBlocked(obj.action, obj.bloid, obj.curid);
      const response: BlockedUserSendDto = {
        user: user,
        action: obj.action,
      }
      this.server.emit('onUpdateBlocked', response, obj.curid);
    } catch (error) {
      const err: ErrorDto = {
        statusCode: error.statusCode,
        message: error.message
      }
      this.server.emit('error', err, obj.curid)
    }
  }

  @SubscribeMessage('userCreation')
  onUpdateConnection(client: Socket, user: UserEntity) {
    this.server.emit('onUserCreation', user);
  }
}

//   @SubscribeMessage('barMove')
//   onNewMessage(@MessageBody() body: any) {
//     // console.log(this.server.)
//     this.server.to(body.room).emit('player2', {ratio: body.ratio, player: body.player, fromAdmin: body.fromAdmin, room: body.room})
// 	}

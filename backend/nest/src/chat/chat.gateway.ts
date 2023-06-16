import {OnModuleInit} from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChanService } from '../chans/chan.service';
import { UserService } from '../user/user.service';
import UserEntity from '../user/entities/user-entity';
import ChanEntity from '../chans/entities/chan-entity';
import {UserJoinChannelReceiveDto, UserJoinChannelSendDto} from "./dto/userjoinchannel.dto";
import {LeaveRoomReceiveDto, LeaveRoomSendDto} from "./dto/leaveroom.dto";
import {ErrorDto} from "./dto/error.dto";
import {MuteToChannelReceiveDto, MuteToChannelSendDto, TimerOutMuteDto} from "./dto/muteToChannel.dto";
import {BanToChannelReceiveDto, BanToChannelSendDto, TimerOutBanDto} from "./dto/banToChannel.dto";
import {AdminToChannelReceiveDto, AdminToChannelSendDto} from "./dto/adminToChannel.dto";
import {AddToChannelReceiveDto} from "./dto/addToChannel.dto";
import {NewMessageSendDto} from "./dto/newMessage.dto";

@WebSocketGateway({
  cors: {
    origin: ['http://cousinade-baudry.fr'],
  },
  namespace: '/chat'
})
export class ChatGateway implements OnModuleInit
{
  constructor(
    private readonly chanService: ChanService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
    });
  }

    checkIfUserIsBlocking(sender: UserEntity, chan: ChanEntity): boolean {
      for (let i: number = 0; i < sender.blocked.length; i++) {
          for (let j: number = 0; j < chan.chanUser.length; j++) {
              if (sender.blocked[i] === chan.chanUser[j].auth_id) {
                  return true
              }
          }
      }
      return false;
    }

    checkIfUserIsBlocked(sender: UserEntity, chan: ChanEntity): boolean {
      for (let i: number = 0; i < chan.chanUser.length; i++) {
          for (let j: number = 0; j < chan.chanUser[i].blocked.length; j++) {
              for (let k: number = 0; k < chan.chanUser.length; k++) {
                  if (chan.chanUser[k].auth_id === chan.chanUser[i].blocked[j]) {
                      return true;
                  }
              }
          }
      }
      return false;
    }

  @SubscribeMessage('newMessage')
  async onNewMessage(client: Socket, @MessageBody() body: any): Promise<void> {
      const sender: UserEntity = await this.userService.findOnebyUsername(body.username);
      if (!sender) {
          const err: ErrorDto = {
              statusCode: 404,
              message: 'Error while sending a new message: Cant find sender'
          }
          this.server
              .to(body.room)
              .emit('error', err, body.auth_id);
          return ;
      }
      const chan: ChanEntity = await this.chanService.findOnebyID(body.room);
      if (!chan) {
          const err: ErrorDto = {
              statusCode: 404,
              message: 'Error while sending a new message: Cant find room'
          }
          this.server
              .to(body.room)
              .emit('error', err, body.auth_id);
            return ;
      }
      if (chan.chanUser.find(elem => elem === sender)) {
          const err: ErrorDto = {
              statusCode: 452,
              message: 'Error while sending a new message: User not in chat'
          }
          this.server
              .to(body.room)
              .emit('error', err, body.auth_id);
            return ;
      }
      const mfound: UserEntity = chan.muteUser.find(elem => elem.auth_id === sender.auth_id)
      if (mfound) {
          const err: ErrorDto = {
              statusCode: 451,
              message: 'Message not sent: User had been muted'
          }
          this.server
              .to(body.room)
              .emit('error', err, body.auth_id);
          return ;
      }
      const bfound: UserEntity = chan.banUser.find(elem => elem.auth_id === sender.auth_id);
      if (bfound) {
          const err: ErrorDto = {
              statusCode: 450,
              message: 'Message not sent: User had been banned'
          }
          this.server
              .to(body.room)
              .emit('error', err, body.auth_id);
          return ;
      }
      if (chan.type === 'direct') {
          if (chan.chanUser.length !== 2) {
              const err: ErrorDto = {
                  statusCode: 400,
                  message: 'Message not sent: Wrong number of users for direct conversation'
              }
              this.server
                  .to(body.room)
                  .emit('error', err, body.auth_id);
          }
          if (this.checkIfUserIsBlocking(sender, chan) || this.checkIfUserIsBlocked(sender, chan)) {
              const err: ErrorDto = {
                  statusCode: 400,
                  message: 'Message not sent: User blocked/blocking'}
              this.server
                  .to(body.room)
                  .emit('error', err, body.auth_id);
              return ;
          }
      }
      const response: NewMessageSendDto = {
          msg: 'New Message',
          content: body.chat,
          sender_socket_id: body.sender_socket_id,
          username: body.username,
          avatar: body.avatar,
          auth_id: body.auth_id,
          room: body.room
      }
    this.server
        .to(body.room)
        .emit('onMessage', response);
	await this.chanService.addMessage({
		content: body.chat,
		sender_socket_id: body.sender_socket_id,
		username: body.username,
		avatar: body.avatar,
        auth_id: body.auth_id,
		room: body.room
	})
}

  @SubscribeMessage('joinRoom')
  async onJoinRoom(
    client: Socket,
    body: string[] /* room: string, auth_id: string */,
  ): Promise<void> {
  	client.join(body[0]);
  	const usr: UserEntity = await this.userService.findOneByAuthId(body[1])
      if (!usr) {
          const err: ErrorDto = {
              statusCode: 404,
              message: 'Error while joining room: Cant find user'
          }
          this.server
              //.to(body[0])
              .emit('error', err, body[1]);
            return ;
      }
      let chan: ChanEntity = undefined;
      try {
          chan = await this.chanService.addUserToChannel(usr, body[0])
      } catch (error) {
          const err: ErrorDto = {
              statusCode: error.statusCode,
              message: error.message
          }
          this.server
              .to(body[0])
              .emit(
                  'error', err, body[1]);
            return ;
      }
  	client.emit('joinedRoom', body[0]);
      const response: UserJoinChannelSendDto = {
          chan: chan,
          userid: usr.auth_id,
      }
  	this.server
        .to(body[0])
        .emit("userJoinChannel", response);
  }

  @SubscribeMessage('addToChannel')
  async onAddTochannel(client: Socket, body: AddToChannelReceiveDto): Promise<void> {
     try {
         const usr: UserEntity = await this.userService.findOneByAuthId(body.auth_id)
         if (!usr) {
             const err: ErrorDto = {
                 statusCode: 404,
                 message: 'Error while adding new channel: Cant find user'
             }
             this.server
                 .emit('error', err, body.auth_id)
            return ;
         }
         const chan: ChanEntity = await this.chanService.addUserToChannel(usr, body.room)
         client.emit('joinedRoom', body.room);
         const response: UserJoinChannelSendDto = {
             chan: chan,
             userid: usr.auth_id,
         }
         this.server
             .to(body.room)
             .emit("userJoinChannel", response);
     } catch (error) {
         const err: ErrorDto = {
             statusCode: error.statusCode,
             message: error.message
         }
         this.server
             .to(body[0])
             .emit('error', err, body.auth_id);
         return ;
     }
  }

  launchCounterBan(client: Socket, auth_id: string, room: string): void {
        setTimeout(async () => {
            const response: TimerOutBanDto = {
                auth_id: auth_id,
                room: room,
            }
            this.server.emit('timerOutBan', response);
            try {
                await this.chanService.banUserToChannel(auth_id, room, false)
            } catch (error) {
                const err: ErrorDto = {
                    statusCode: error.statusCode,
                    message: error.message
                }
                this.server
                    .to(room)
                    .emit('error', err, auth_id);
                return ;
            }
        }, 10000)
  }

    launchCounterMute(client: Socket, auth_id: string, room: string): void {
        setTimeout(async () => {
            const response: TimerOutMuteDto = {
                auth_id: auth_id,
                room: room,
            }
            this.server.emit('timerOutMute', response);
            try {
                await this.chanService.muteUserToChannel(auth_id, room, false)
            } catch (error) {
                const err: ErrorDto = {
                    statusCode: error.statusCode,
                    message: error.message
                }
                this.server
                    .to(room)
                    .emit('error', err, auth_id);
                return ;
            }
        }, 10000)
    }

    @SubscribeMessage('adminToChannel')
    async adminUserToChannel(client: Socket, body: AdminToChannelReceiveDto): Promise<void> {
      try {
          await this.chanService.adminUserToChannel(body.auth_id, body.room, body.action)
          client.emit('adminRoom');
          const response: AdminToChannelSendDto = {
              room: body.room,
              auth_id: body.auth_id,
              action: body.action
          }
          this.server
              .to(body.room)
              .emit("adminChannel", response)
      } catch (error) {
          const err: ErrorDto = {
              statusCode: error.statusCode,
              message: error.message
          }
          this.server
              .to(body.room)
              .emit('error', err, body.auth_id);
          return ;
      }
    }

    @SubscribeMessage('banToChannel')
    async banUserToChannel(client: Socket, body: BanToChannelReceiveDto): Promise<void> {
        try {
            await this.chanService.banUserToChannel(body.auth_id, body.room, body.action)
            client.emit('banRoom');
            const response: BanToChannelSendDto = {
                room: body.room,
                auth_id: body.auth_id,
                action: body.action
            }
            this.server
                .to(body.room)
                .emit("bannedChannel", response);
            if (body.action === true) {
                this.launchCounterBan(client, body.auth_id, body.room);
            }
        } catch (error) {
            const err: ErrorDto = {
                statusCode: error.statusCode,
                message: error.message
            }
            this.server
                .to(body.room)
                .emit('error', err, body.auth_id);
        }
    }

    @SubscribeMessage('muteToChannel')
    async mutenUserToChannel(client: Socket, body: MuteToChannelReceiveDto): Promise<void> {
      try {
            await this.chanService.muteUserToChannel(body.auth_id, body.room, body.action)
            client.emit('muteRoom');
            const response: MuteToChannelSendDto = {
                room: body.room,
                auth_id: body.auth_id,
                action: body.action
            }
            this.server
                .to(body.room)
                .emit("mutedChannel", response);
            if (body.action === true) {
                this.launchCounterMute(client, body.auth_id, body.room);
            }
        } catch (error) {
          const err: ErrorDto = {
              statusCode: error.statusCode,
              message: error.message
          }
            this.server
                .to(body.room)
                .emit('error', err, body.auth_id);
            return ;
        }
    }

    @SubscribeMessage('leaveRoom')
    async onLeaveRoom(client: Socket, body: LeaveRoomReceiveDto): Promise<void> {
  	try {
        const usr: UserEntity = await this.userService.findOneByAuthId(body.auth_id);
        const chan: ChanEntity = await this.chanService.delUserToChannel(usr, body.room)
        const response: LeaveRoomSendDto = {
            userid: body.auth_id,
            chan: chan,
        }
        this.server.emit('userLeaveChannel', response);
        client.emit('leftRoom', {room: ChanEntity});
      } catch (error) {
          const err: ErrorDto = {
            statusCode: error.statusCode,
              message: error.message
          }
        this.server
            .to(body.room)
            .emit('error', err, body.auth_id);
        return ;
      }
  }

  @SubscribeMessage('chanCreated')
  onChanCreated(client: Socket, obj: UserJoinChannelReceiveDto): void {
      const response: UserJoinChannelSendDto = {
          chan: obj.chan,
          userid: obj.auth_id,
      }
      this.server.emit('userJoinChannel', response);
  }

  @SubscribeMessage('newParty')
  onNewParty(client: Socket): void {
	this.server.emit('onNewParty');
  }

  @SubscribeMessage('updateChan')
  onUpdateChan(client: Socket, room:string): void {
        const obj = { room : room}
      this.server.emit('chanDeleted', obj);
  }
}

import { Get, Injectable, Param } from '@nestjs/common';

@Injectable()
export class AvailableChanService {
    channels: any[] = [
        {
            name : "yolo",
            status : "protected",
            password : "psswd",
            administrator : "administrator_id",
            users :
            {
              user1 : "userid1",
              user2 : "userid2",
              user3 : "userid3"
            }
        },
        {
            name : "patate",
            status : "public",
            password : "",
            administrator : "administrator_id",
            users :
            {
              user1 : "userid1",
              user2 : "userid2",
              user3 : "userid3"
            }
        }
      ];

      findOneChan(name: string) {
          return this.channels.find(chan => chan.name === name);
      }

      findAllAvailableChannel(): any[] {
        return this.channels;
    }
}

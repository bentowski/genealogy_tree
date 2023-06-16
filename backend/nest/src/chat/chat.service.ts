import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
 constructor(
   @InjectRepository(Chat) private chatRepository: Repository<Chat>,
 ) {}
 async createMessage(chat: Chat): Promise<Chat> {
   return await this.chatRepository.save(chat);
 }

 async getMessages(): Promise<Chat[]> {
   return await this.chatRepository.find();
 }
}

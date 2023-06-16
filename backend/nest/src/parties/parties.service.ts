import { Injectable } from '@nestjs/common';
import PartiesEntity from './entities/parties-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartiesDto } from "./dto/create-parties.dto";
import { HistoryEntity } from './entities/history-entity';
import { HistorySavePartiesDto } from './dto/history-save-parties.dto';
import { UserService } from '../user/user.service';
import * as io from "socket.io-client";

const update = io.connect("http://82.165.70.203:3000/update");

@Injectable()
export class PartiesService {

    constructor(
        @InjectRepository(PartiesEntity)
        private readonly partiesRepository: Repository<PartiesEntity>,
        @InjectRepository(HistoryEntity)
        private readonly historyRepository: Repository<HistoryEntity>,
        private readonly userService: UserService
    ) { }

    async findAllAvailableParties(login: string): Promise<PartiesEntity[]> {
        let parties: PartiesEntity[] = await this.partiesRepository.find();
        return parties.filter(parties => parties.login.includes(login));
    }

    findParties(): Promise<PartiesEntity[]> {
        return this.partiesRepository.find();
    }

    async findParty(id:number): Promise<PartiesEntity> {
      let parties: PartiesEntity[] = await this.partiesRepository.find();
      return parties.find(parties => parties.id === id);
    }

    createPartiesEntity(createPartiesDto: CreatePartiesDto): Promise<PartiesEntity> {
        const parties: PartiesEntity = new PartiesEntity();
        parties.nbplayer = createPartiesDto.nbplayer;
        parties.login = createPartiesDto.login;
        parties.type = createPartiesDto.type;
        parties.vitesse = createPartiesDto.vitesse;
        try {
            return this.partiesRepository.save(createPartiesDto);
        } catch (error) {
            throw new Error(error);
        }
    }

    remove(id: string): void {
        this.partiesRepository.delete(id);
    }

    findHistories(): Promise<HistoryEntity[]> {
        return this.historyRepository.find();
    }

    async createHistories(historySavePartiesDto: HistorySavePartiesDto): Promise<HistoryEntity> {
        try {
            const { user_one_id, user_two_id, score_one, score_two } = historySavePartiesDto;
            const histories: HistoryEntity = this.historyRepository.create(historySavePartiesDto);
            const user_one = await this.userService.findOneByAuthId(user_one_id)
            const user_two = await this.userService.findOneByAuthId(user_two_id)
            histories.user_one_id = user_one_id;
            histories.user_two_id = user_two_id;
            histories.score_one = score_one;
            histories.score_two = score_two;
            histories.user_one_name = user_one.username;
            histories.user_two_name = user_two.username;
            histories.createdAt = new Date();
            await this.historyRepository.save(histories)
            return histories;
        } catch (error) {
            throw new Error(error);
        }
    }

    async addToGame(id: string, auth_id: string) {
        let game: PartiesEntity = await this.partiesRepository.findOne({
            where : { id: Number(id)}
        })
        if (game.p1 === null) {
            game.p1 = auth_id;
			update.emit('newParty');
            update.emit('updateUser', { auth_id: auth_id, status: 2 })
		}
        else if (game.p1 === auth_id)
            return ;
        else if (game.p2 === null) {
            game.p2 = auth_id;
			update.emit('newParty');
            update.emit('updateUser', { auth_id: auth_id, status: 2 })
		}
        try {
            await this.partiesRepository.save(game);
        } catch (error) {
            throw new Error(error);
        }
    }
}

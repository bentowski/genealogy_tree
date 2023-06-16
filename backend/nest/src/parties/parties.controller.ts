import {Controller, Get, Param, Delete, Post, Body, UseGuards} from '@nestjs/common';
import { PartiesService } from './parties.service';
import { CreatePartiesDto } from './dto/create-parties.dto';
import { HistorySavePartiesDto } from "./dto/history-save-parties.dto";
import { HistoryEntity } from './entities/history-entity';
import {AuthGuard} from "@nestjs/passport";
import {UserAuthGuard} from "../auth/guards/user-auth.guard";
import PartiesEntity from "./entities/parties-entity";

@Controller('parties')
@UseGuards(AuthGuard('jwt'), UserAuthGuard)
export class PartiesController {
    constructor(private readonly partiesService: PartiesService) { }

    @Get(':name')
    findAllAvailableParties(@Param('name') name: string): Promise<PartiesEntity[]>  {
        try {
            return this.partiesService.findAllAvailableParties(name);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get()
    getParties(): Promise<PartiesEntity[]> {
        try {
            return this.partiesService.findParties();
        } catch (error) {
            throw new Error(error);
        }
    }

    @Post('create')
    createParties(@Body() createPartiesDto: CreatePartiesDto): Promise<PartiesEntity> {
        try {
            return this.partiesService.createPartiesEntity(createPartiesDto);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Delete(':id')
    remove(@Param('id') username: string): void {
        try {
            return this.partiesService.remove(username);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get('histories/all')
    async getHistories(): Promise<HistoryEntity[]> {
        try {
            return await this.partiesService.findHistories();
        } catch (error) {
            throw new Error(error);
        }
    }

    @Post('histories/create')
    createHistories(@Body() historySavePartiesDto: HistorySavePartiesDto): Promise<HistoryEntity> {
        try {
            return this.partiesService.createHistories(historySavePartiesDto);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Delete('histories/:id')
    removeHistories(@Param('id') username: string): void {
        try {
            return this.partiesService.remove(username);
        } catch (error) {
            throw new Error(error);
        }
    }
}

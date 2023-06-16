import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import { AvailableChanService } from './available-chan.service';
import {AuthGuard} from "@nestjs/passport";
import {UserAuthGuard} from "../auth/guards/user-auth.guard";

@Controller('available-chan')
@UseGuards(AuthGuard('jwt'), UserAuthGuard)
export class AvailableChanController {
    constructor(private readonly availableChanService: AvailableChanService ) {}


    @Get(':name')
    findOneChan(@Param('name') name: string): void {
        return (this.availableChanService.findOneChan(name));
    }

    @Get()
    findAllAvailableChannel(): any[] {
        return this.availableChanService.findAllAvailableChannel();
    }
}

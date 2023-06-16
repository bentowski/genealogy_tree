import {NotFoundException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req} from "@nestjs/common";
import { ChanService } from "./chan.service";
import { CreateChanDto, CreatePrivChanDto } from "./dto/create-chan.dto";
import {AuthGuard } from "@nestjs/passport";
import { UserAuthGuard } from "../auth/guards/user-auth.guard";
import UserEntity from "../user/entities/user-entity";
import ChanEntity from "./entities/chan-entity";
import { ChanPasswordDto } from "./dto/chan.dto";

@Controller('chan')
@UseGuards(AuthGuard('jwt'), UserAuthGuard)
export class ChanController {
    constructor(private readonly chanService: ChanService) {}

    @Get()
    getChans(): Promise<ChanEntity[]> { return this.chanService.findAll(); }

    @Get(':name')
    async findOne(@Param('name') name: string): Promise<ChanEntity> {
        const chan: ChanEntity = await this.chanService.findOne(name);
        if (!chan) {
            throw new NotFoundException('Error while fetching chan by name: Cant find chan');
        }
        return chan;
    }

    @Get('/id/:id')
    async findOnebyID(@Param('id') id: string): Promise<ChanEntity> {
        const chan: ChanEntity = await this.chanService.findOnebyID(id);
        if (!chan) {
            throw new NotFoundException('Error while fetching chan by id: Cant find chan');
        }
        return (chan);
    }

    @Post('create')
    createChan(@Body() createChanDto: CreateChanDto): Promise<ChanEntity> {
        try {
            return this.chanService.createChan(createChanDto);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Post('createpriv')
    createPrivChan(@Body() createPrivChanDto: CreatePrivChanDto): Promise<ChanEntity> {
        try {
            return this.chanService.createPrivChan(createPrivChanDto);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get(':id/banned')
    getBanned(@Param('id') idroom: string): Promise<UserEntity[]> {
        try {
            return this.chanService.getBanned(idroom);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get(':idroom/isadmin/:iduser')
    async isAdmin(@Param('idroom') idroom: string,
                  @Param('iduser') iduser: string,
    ): Promise<boolean> {
        const chan: ChanEntity = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            throw new NotFoundException('Error while checking user status: Cant find chan');
        }
        for (let i = 0; i < chan.adminUser.length; i++) {
            if (chan.adminUser[i].auth_id === iduser) {
                return true
            }
        }
        return false;
    }

    @Get(':idroom/isowner/:iduser')
    async isOwner(@Param('idroom') idroom: string,
                  @Param('iduser') iduser: string,
    ): Promise<boolean> {
        const chan: ChanEntity = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            throw new NotFoundException('Error while checking user status: Cant find chan');
        }
        return chan.owner === iduser;
    }

    @Get(':idroom/isbanned/:iduser')
    async isBanned(@Param('idroom') idroom: string,
                   @Param('iduser') iduser: string,
    ): Promise<boolean> {
        const chan: ChanEntity = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            throw new NotFoundException('Error while checking user status: Cant find chan');
        }
        for (let index = 0; index < chan.banUser.length; index++) {
            if (iduser === chan.banUser[index].auth_id) {
                return true;
            }
        }
        return false;
    }

    @Get(':idroom/ismuted/:iduser')
    async isMuted(@Param('idroom') idroom: string,
                  @Param('iduser') iduser: string,
    ): Promise<boolean> {
        const chan: ChanEntity = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            throw new NotFoundException('Error while checking user status: Cant find chan');
        }
        for (let index = 0; index < chan.muteUser.length; index++) {
            if (iduser === chan.muteUser[index].auth_id) {
                return true;
            }
        }
        return false;
    }

    @Get(':idroom/ispresent/:iduser')
    async isPresent(@Param('idroom') idroom: string,
                    @Param('iduser') iduser: string,
    ): Promise<boolean> {
        const chan: ChanEntity = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            throw new NotFoundException('Error while checking if user is present in chan: Cant find chan');
        }
        for (let index = 0; index < chan.chanUser.length; index++) {
            if (iduser === chan.chanUser[index].auth_id) {
                return true;
            }
        }
        return false;
    }

    @Get(':id/muted')
    getMuted(@Param('id') idroom: string): Promise<UserEntity[]> {
        try {
            return this.chanService.getMuted(idroom);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get(':id/user')
    getUsers(@Param('id') idroom: string): Promise<UserEntity[]> {
        try {
            return this.chanService.getUsers(idroom);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get(':id/admin')
    getAdmins(@Param('id') idroom: string): Promise<UserEntity[]> {
        try {
            return this.chanService.getAdmins(idroom);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Delete(':id')
    async remove(@Param('id') name: string): Promise<void> {
        try {
            await this.chanService.remove(name);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Patch(':id/verify')
    verifyPass(
        @Param('id') cid: string,
        @Body() obj: ChanPasswordDto,
        @Req() req
    ) {
        const uid: string = req.user['auth_id'];
        try {
            return this.chanService.verifyPass(cid, obj.pass, uid)
        } catch (error) {
            throw new Error(error);
        }
    }

	@Post('chanchat')
	tryChan(@Body() test: any): Promise<ChanEntity> {
        try {
            return this.chanService.addMessage(test);
            return this.chanService.addMessage(test);
        } catch (error) {
            throw new Error(error);
        }
	}
}

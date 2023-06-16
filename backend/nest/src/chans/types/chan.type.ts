import UserEntity from "../../user/entities/user-entity";
import {Msg} from "./msg.type";

export type ChanType = {
    type: string,
    name: string,
    owner: string,
    password: string,
    messages: Msg[],
    chanUser: UserEntity[],
    banUser: UserEntity[],
    muteUser: UserEntity[],
    adminUser: UserEntity[],
}
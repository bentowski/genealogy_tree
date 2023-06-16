import {ChanType} from "../types";

export interface UserJoinChannelReceiveDto {
    chan: ChanType | undefined;
    auth_id: string;
}

export interface UserJoinChannelSendDto {
    chan: ChanType;
    userid: string;
}
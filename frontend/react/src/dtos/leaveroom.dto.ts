import {ChanType} from "../types";

export interface LeaveRoomReceiveDto {
    room: string;
    auth_id: string;
}

export interface LeaveRoomSendDto {
    userid: string;
    chan: ChanType;
}
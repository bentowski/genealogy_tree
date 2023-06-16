export interface MuteToChannelReceiveDto {
    room: string;
    auth_id: string;
    action: boolean;
}

export interface MuteToChannelSendDto {
    room: string;
    auth_id: string;
    action: boolean;
}

export interface TimerOutMuteDto {
    auth_id: string;
    room: string;
}

export interface BanToChannelReceiveDto {
    room: string;
    auth_id: string;
    action: boolean;
}

export interface BanToChannelSendDto {
    room: string;
    auth_id: string;
    action: boolean;
}
export interface TimerOutBanDto {
    auth_id: string;
    room: string;
}
export interface AdminToChannelReceiveDto {
    room: string;
    auth_id: string;
    action: boolean;
}

export interface AdminToChannelSendDto {
    room: string;
    auth_id: string;
    action: boolean;
}
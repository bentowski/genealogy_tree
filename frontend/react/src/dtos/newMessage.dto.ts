export interface NewMessageReceiveDto {

}

export interface NewMessageSendDto {
    msg: string;
    content: string;
    sender_socket_id: string;
    username: string;
    avatar: string;
    auth_id: string;
    room: string;
}
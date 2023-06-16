import {UserType} from "../types";

export interface  FriendUserReceiveDto {
    curid: string;
    frid: string;
    action: boolean;
}

export interface FriendUserSendDto {
    curuser: UserType;
    friuser: UserType;
    action: boolean;
}
import {UserType} from "../types";

export interface BlockedUserReceiveDto {
    curid: string;
    bloid: string;
    action: boolean;
}

export interface BlockedUserSendDto {
    user: UserType;
    action: boolean;
}
export interface CreateChanDto {
    type: string;
    name: string;
    owner: string;
    password: string;
}

export interface CreatePrivChanDto {
    type: string;
    name: string;
    user_1_id: string;
    user_2_id: string;
}

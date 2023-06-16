
export interface UpdateUsernameDto {
  username: string;
}

export interface UpdateAvatarDto {
  avatar: string;
}

export interface UpdateFriendsDto {
  action: boolean;
  auth_id: string;
}

export interface BlockedUserDto {
  auth_id: string;
  action: boolean;
}
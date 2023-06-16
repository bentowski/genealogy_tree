import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Request from "../components/utils/Requests";
import { AuthType, ChanType, UserType } from "../types";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {FriendUserSendDto} from "../dtos/friend-user.dto";

const socket = io('http://82.165.70.203:3000/update')
export const AuthContext = createContext<any>({});
export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isTwoFa, setIsTwoFa] = useState<boolean>(false);
  const [isToken, setIsToken] = useState<boolean>(false);
  const [user, setUser] = useState<any>();
  const [errorShow, setErrorShow] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [errorCode, setErrorCode] = useState<number>(0);
  const [userList, setUserList] = useState<UserType[]>([]);
  const [friendsList, setFriendsList] = useState<UserType[]>([]);
  const [blockedList, setBlockedList] = useState<UserType[]>([]);
  const [bannedFrom, setBannedFrom] = useState<ChanType[]>([]);
  const [mutedFrom, setMutedFrom] = useState<ChanType[]>([]);
  const [chanFrom, setChanFrom] = useState<ChanType[]>([]);
  const [adminFrom, setAdminFrom] = useState<ChanType[]>([]);
  const navigate: NavigateFunction = useNavigate();
  const location: any = useLocation();
  //const socket = useContext(WebsocketContextUpdate);



  const updateFriendsList = useCallback((
      usr: UserType,
      action: boolean): void => {
    if (action) {
      setFriendsList(prevState => [...prevState, usr]);
      return ;
    } else if (!action) {
      const idx: number = friendsList.findIndex(obj => {
        return obj.auth_id === usr.auth_id;
      });
      const array: UserType[] = [ ...friendsList ];
      if (idx !== -1) {
        array.splice(idx, 1);
        setFriendsList(array);
        return ;
      }
    }
  }, [friendsList])

  useEffect(() => {
    const handleUpdateFriends = (obj: FriendUserSendDto) => {
      if (user.auth_id === obj.curuser.auth_id) {
        updateFriendsList(obj.friuser, obj.action);
        return ;
      }
      if (user.auth_id === obj.friuser.auth_id) {
        updateFriendsList(obj.curuser, obj.action);
        return ;
      }
    }
    socket.on('onUpdateFriend', handleUpdateFriends);
    return () => {
      socket.off('onUpdateFriend', handleUpdateFriends);
    }
  },[user, updateFriendsList, friendsList])

  const updateBlockedList = useCallback((
      usr: UserType,
      action: boolean): void => {
    if (action) {
      setBlockedList(prevState => [...prevState, usr]);
      return ;
    } else if (!action) {
      const idx: number = blockedList.findIndex(obj => {
        return obj.auth_id === usr.auth_id;
      });
      const array: UserType[] = [...blockedList];
      if (idx !== -1) {
        array.splice(idx, 1);
        setBlockedList(array);
        return ;
      }
    }
  }, [blockedList])

  useEffect(() => {
    const handleUserCreation = (user: UserType) => {
      setUserList(prevState => [...prevState, user]);
    }
    socket.on('onUserCreation', handleUserCreation);
    return () => {
      socket.off('onUserCreation', handleUserCreation);
    }
  }, [userList])

  const updateBannedFromList = useCallback( (
      chan: ChanType,
      action: boolean): void => {
    if (action) {
      setBannedFrom(prevState => [...prevState, chan])
    }
    if (!action) {
      const idx: number = bannedFrom.findIndex(obj => {
        return obj.id === chan.id;
      })
      const newArr: ChanType[] = bannedFrom;
      if (idx !== -1) {
        newArr.splice(idx, 1);
      }
      setBannedFrom(newArr);
    }
  }, [bannedFrom])

  const updateAdminFromList = useCallback((
      chan: ChanType,
      action: boolean): void => {
    if (action) {
      setAdminFrom(prevState => [...prevState, chan])
    }
    if (!action) {
      const i: number = adminFrom.findIndex(obj => {
        return obj.id === chan.id;
      })
      const newArr: ChanType[] = adminFrom;
      if (i !== -1) {
        newArr.splice(i, 1);
      }
      setAdminFrom(newArr);
    }
  }, [adminFrom])


  const updateMutedFromList = useCallback(  (
      chan: ChanType, action: boolean): void => {
      if (action) {
        setMutedFrom(prevState => [...prevState, chan])
      }
      if (!action) {
        const idx: number = mutedFrom.findIndex(obj => {
          return obj.id === chan.id;
        })
        const newArr: ChanType[] = mutedFrom;
        if (idx !== -1) {
          newArr.splice(idx, 1);
        }
        setMutedFrom(newArr);
      }
  }, [mutedFrom])

  const updateChanFromList = useCallback((
      chan: ChanType,
      action: boolean): void => {
      if (action) {
        setChanFrom(prevState => [...prevState, chan])
      }
      if (!action) {
        const idx = chanFrom.findIndex(obj => {
          if (!obj || !chan)
            return false;
          return obj.id === chan.id;
        })
        const newArr: ChanType[] = chanFrom;
        if (idx !== -1) {
          newArr.splice(idx, 1);
        }
        setChanFrom(newArr);
      }
  }, [chanFrom])

  const updateUser = useCallback((avatar: string, username: string): void => {
    if (avatar || username) {
      const usr: UserType = {
        user_id: user?.user_id,
        auth_id: user?.auth_id,
        username: username ? username : user?.username,
        avatar: avatar ? avatar : user?.avatar,
        game_won: user?.game_won,
        game_lost: user?.game_lost,
        total_games: user?.total_games,
        total_score: user?.total_score,
        status: user?.status,
        twoFASecret: user?.twoFASecret,
        isTwoFA: user?.isTwoFA,
        channelJoind: user?.channelJoind,
        friends: user?.friends,
        blocked: user?.blocked,
      }
      setUser(usr);
    }
  }, [user])

  const userAuthentication = useCallback((auth: boolean): void => {
    if (user) {
      setIsAuth(auth);
    }
  }, [user])

  const updateIsTwoFa = useCallback((isFa: boolean) => {
    if (user) {
      setIsTwoFa(isFa);
    }
  }, [user])

  const setError =  useCallback((value: any): void => {
    if (value) {
      setErrorShow(true);
      setErrorMsg(value.message);
      setErrorCode(value.statusCode);
    } else {
      setErrorShow(false);
      setErrorMsg('');
      setErrorCode(0);
    }
  },[])

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      setIsToken(false);
      setUser(undefined);
      setLoading(true);
      try {
        const res: AuthType = await Request(
            "GET",
            {},
            {},
            "http://82.165.70.203:3000/auth/istoken"
        )
        if (res) {
          if (res.isTok === 0) {
            setLoading(false);
            return ;
          } else if (res.isTok > 0) {
            setIsToken(true);
            if (res.isTok === 1) {
              setLoading(false);
              return ;
            } else if (res.isTok > 1) {
              const user: UserType = await Request(
                  "GET",
                  {},
                  {},
                  "http://82.165.70.203:3000/user/current"
              )
              if (user) {
                setUser(user);
                if (res.isTok === 2) {
                  setIsTwoFa(true);
                  setLoading(false);
                  return ;
                } else if (res.isTok === 3) {
                  setIsTwoFa(true);
                  setIsAuth(true);
                  setLoading(false);
                  return ;
                } else if (res.isTok === 4) {

                  //------------------

                  const uselist: UserType[] = await Request(
                    "GET",
                    {},
                    {},
                    "http://82.165.70.203:3000/user/",
                    )
                    setUserList(uselist);

                  //------------------

                  const flist: UserType[] = await Request(
                      "GET",
                      {},
                      {},
                      "http://82.165.70.203:3000/user/" + user.auth_id + "/getfriends",
                  )
                  setFriendsList(flist);

                  //-----------------

                  const blist: UserType[] = await Request(
                      "GET",
                      {},
                      {},
                      "http://82.165.70.203:3000/user/" + user.auth_id + "/getblocked"
                  )
                  setBlockedList(blist);

                  //------------------

                  const mlist: ChanType[] = await Request(
                      "GET",
                      {},
                      {},
                      "http://82.165.70.203:3000/user/chan/muted"
                  )
                  setMutedFrom(mlist);

                  //------------------

                  const banlist: ChanType[] = await Request(
                      "GET",
                      {},
                      {},
                      "http://82.165.70.203:3000/user/chan/banned"
                  )
                  setBannedFrom(banlist);

                  //------------------

                  const jlist: ChanType[] = await Request(
                      "GET",
                      {},
                      {},
                      "http://82.165.70.203:3000/user/chan/joined"
                  )
                  setChanFrom(jlist);

                  //--------------------

                  const alist: ChanType[] = await Request(
                      "GET",
                      {},
                      {},
                      "http://82.165.70.203:3000/user/chan/admin"
                  )
                  setAdminFrom(alist);

                  //--------------------

                  setIsAuth(true);
                  setLoading(false);
                  return ;
                }
              } else {
                setLoading(false);
                return ;
              }
            } else {
              setLoading(false);
              return ;
            }
          } else {
            setLoading(false);
            return ;
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        if (typeof error === "object" && error !== null) {
          setError(error);
          setLoading(false);
        } else {
          setError(error);
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [setError]);

  const memoedValue = useMemo(
    () => ({
      user,
      isAuth,
      isToken,
      isTwoFa,
      bannedFrom,
      mutedFrom,
      adminFrom,
      chanFrom,
      errorShow,
      errorMsg,
      errorCode,
      loading,
      userList,
      friendsList,
      blockedList,
      updateUser: (avatar: string, username: string) => updateUser(avatar, username),
      userAuthentication: (auth: boolean) => userAuthentication(auth),
      updateIsTwoFa: (isFa: boolean) => updateIsTwoFa(isFa),
      updateFriendsList: (usr: UserType, action: boolean) => updateFriendsList(usr, action),
      updateBlockedList: (usr: UserType, action: boolean) => updateBlockedList(usr, action),
      updateBannedFromList: (chan: ChanType, action: boolean) => updateBannedFromList(chan, action),
      updateChanFromList: (chan: ChanType, action: boolean) => updateChanFromList(chan, action),
      updateMutedFromList: (chan: ChanType, action: boolean) => updateMutedFromList(chan, action),
      updateAdminFromList: (chan: ChanType, action: boolean) => updateAdminFromList(chan, action),
      setError: (value: any) => setError(value),
      navigate,
      location,
      socket,
    }),
    [
      errorShow,
      errorMsg,
      errorCode,
      user,
      isAuth,
      loading,
      bannedFrom,
      mutedFrom,
      chanFrom,
      adminFrom,
      isToken,
      isTwoFa,
      updateBannedFromList,
      updateChanFromList,
      updateIsTwoFa,
      updateMutedFromList,
      updateFriendsList,
      updateAdminFromList,
      userAuthentication,
      updateUser,
      updateBlockedList,
      setError,
      userList,
      friendsList,
      blockedList,
      navigate,
      location,
    ]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthData = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Context was used outside of its Provider");
  }
  return context;
};

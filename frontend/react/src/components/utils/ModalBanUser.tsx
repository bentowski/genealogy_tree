import { useAuthData } from "../../contexts/AuthProviderContext";
import Request from "./Requests";
import React, { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { ErrorType, UsersChanBanType, UserType } from "../../types";
import { Socket } from "socket.io-client";
import {BanToChannelReceiveDto} from "../../dtos/banToChannel.dto";

const ModalBanUser = ({chan, socket, usersInChan}:{
    chan: string,
    socket: Socket,
    usersInChan: UserType[]
}): JSX.Element => {
    const { user, setError } = useAuthData();
    const [show, setShow] = useState<boolean>(false);
    const [usersChan, setUsersChan] = useState<UsersChanBanType[]>([{user:undefined,isBan:false}]);
    const [list, setList] = useState<JSX.Element[]>([]);
    //const [loading, setLoading] = useState<boolean>(false);

    useEffect((): void => {
        if (show) {
            //setLoading(true);
            const fetchUsersChan = async (): Promise<void> => {
                try {
                    const users: UserType[] = await Request(
                        "GET",
                        {},
                        {},
                        "http://82.165.70.203:3000/chan/" + chan + "/user"
                    )
                    const newArr: UsersChanBanType[] = [];
                    for (let index: number = 0; index < users.length; index++) {
                        newArr.push({
                            user: users[index],
                            isBan: false,
                        });
                    }
                    const banned: UserType[] = await Request(
                        "GET",
                        {},
                        {},
                        "http://82.165.70.203:3000/chan/" + chan + "/banned"
                    )
                    for (let index = 0; index < banned.length; index++) {
                        newArr.push({
                            user: banned[index],
                            isBan: true,
                        })
                    }
                    setUsersChan(newArr);
                    //setLoading(false);
                } catch (error) {
                    //setLoading(false);
                    setError(error);
                }
            }
            fetchUsersChan();
        }
    }, [chan, setError, usersInChan, show])

    useEffect((): void => {
        const checkIfAdmin = async (id: string): Promise<boolean> => {
            let res: UserType[] = [];
            try {
                res = await Request(
                    "GET",
                    {},
                    {},
                    "http://82.165.70.203:3000/chan/" + chan + "/admin"
                )
            } catch (error) {
                setError(error);
            }
            for (let i: number = 0; i < res.length; i++) {
                if (id === res[i].auth_id) {
                    return true;
                }
            }
            return false;
        }
        const banUser = async (obj: any): Promise<void> => {
            if (await checkIfAdmin(obj.user.auth_id)) {
                const error: ErrorType = {
                    statusCode: 400,
                    message: 'Cant ban user: User is admin'
                }
                setError(error);
                return ;
            }
            const res: BanToChannelReceiveDto = {
                room: chan,
                auth_id: obj.user.auth_id,
                action: !obj.isBan
            }
            socket.emit('banToChannel', res);
            /*
            const newArray: UsersChanBanType[] = [];
            for (let index: number = 0; index < usersChan.length; index++) {
                if (usersChan[index].user?.auth_id === obj.user.auth_id) {
                    usersChan[index].isBan = !obj.isBan;
                }
                newArray.push(usersChan[index]);
            }
            setUsersChan(newArray);
             */
        }
        const listUserCards = (): void => {
            const ret: JSX.Element[] = [];

            for(let x: number = 0; x < usersChan.length; x++) {
                if (usersChan[x].user && usersChan[x].user?.auth_id !== user.auth_id) {
                    ret.push(
                        <div
                            key={x}
                            className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center">
                            <div
                                className="col-5 h-100 overflow-hidden buttons">
                                <button
                                    type="button"
                                    onClick={ () => banUser(usersChan[x]) }>
                                    {
                                        usersChan[x].isBan ?
                                            <p>UNBAN</p> :
                                            <p>BAN</p>
                                    }
                                </button>
                            </div>
                            <div
                                className="col-2 d-flex flex-row d-flex justify-content-center">
                                <input
                                    className={usersChan[x].user?.status ? "online" : "offline"}
                                    type="radio"></input>
                            </div>
                            <div
                                className="col-5 d-flex flex-row justify-content-end align-items-center">
                                <Link
                                    to={"/profil/" + usersChan[x].user?.username}
                                    className="mx-2">
                                    {usersChan[x].user?.username}
                                </Link>
                                <img
                                    alt=""
                                    src={'http://82.165.70.203:3000/user/' +
                                        usersChan[x].user?.auth_id + '/avatar'}
                                    className="miniAvatar"
                                    width={150}
                                    height={150}/>
                            </div>
                        </div>
                    );
                }
            }
            setList(ret);
        }
        if (usersChan) {
            listUserCards();
        }
    }, [chan, setError, socket, user, usersInChan, usersChan])

    const handleClose = (): void => {
        setShow(false);
    }

    const handleOpen = (): void => {
        setShow(true);
    }

    return (
        <div className="col-4 d-flex justify-content-start">
            <Modal show={show} id="ModalCode" onHide={handleClose}>
                <div className="p-4 pb-1">
                    <Modal.Header className="mb-3">
                        <h2>Ban/Unban user from chan for 10 seconds</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="mb-3">
                            <div>
                                {/* loading ? */}
                                {/* <p>Please wait...</p> */}
                                    {list}
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="mx-1" onClick={handleClose}>
                            Close
                        </button>
                    </Modal.Footer>
                </div>
            </Modal>
            <button className="col-6" onClick={handleOpen}>BAN</button>
        </div>
        )
}
export default ModalBanUser;

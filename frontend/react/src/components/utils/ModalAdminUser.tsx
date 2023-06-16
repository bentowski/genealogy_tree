import { Socket } from "socket.io-client";
import React, { ReactNode, useEffect, useState } from "react";
import Request from "./Requests";
import { useAuthData } from "../../contexts/AuthProviderContext";
import { Modal } from 'react-bootstrap';
import {ErrorType, UsersChanAdminType, UserType} from "../../types";
import { Link } from "react-router-dom";
import {AdminToChannelReceiveDto} from "../../dtos/adminToChannel.dto";

const ModalAdminUser = ({
                            chan,
                            socket,
                            usersInChan}:{
    chan: string,
    socket: Socket,
    usersInChan: UserType[]
}): JSX.Element => {
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    //const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<ReactNode[]>([]);
    //const [channel, setChannel] = useState<ChanType>()
    const [usersChan, setUsersChan] = useState<UsersChanAdminType[]>([{user: undefined, isAdmin: false}]);
    const { setError, user, adminFrom } = useAuthData();

    useEffect(() => {
        //setLoading(true);
        /*
        const fetchChannel = async (): Promise<void> => {
            console.log('CHAN = ', chan)
            try {
                const res: ChanType = await Request(
                    "GET",
                    {},
                    {},
                    "http://82.165.70.203:3000/chan/id/" + chan,
                )
                setChannel(res);
            } catch (error) {
                setError(error);
            }
        }

         */
        const fetchOwner = async (): Promise<void> => {
            try {
                const res: boolean = await Request(
                    "GET",
                    {},
                    {},
                    "http://82.165.70.203:3000/chan/" +
                    chan + "/isowner/" + user.auth_id,
                )
                setIsOwner(res);
            } catch (error) {
                setError(error);
            }
        }
        const fetchUsersChan = async (): Promise<void> => {
            let users: UserType[] = [];
            try {
                users = await Request(
                    "GET",
                    {},
                    {},
                    "http://82.165.70.203:3000/chan/" +
                    chan + "/user"
                )
            } catch(error) {
                setError(error);
            }
            const newArray: UsersChanAdminType[] = [];
            for (let index: number = 0; index < users.length; index++) {
                try {
                    const result: boolean = await Request(
                        "GET",
                        {},
                        {},
                        "http://82.165.70.203:3000/chan/" +
                        chan + "/isadmin/" + users[index].auth_id,
                    )
                    newArray.push({
                        user: users[index],
                        isAdmin: result,
                    })
                } catch (error) {
                    setError(error);
                }
            }
            setUsersChan(newArray);
            //setLoading(false);
        }
        fetchOwner();
        if (show) {
            fetchUsersChan();
        }
        //fetchChannel();
    }, [chan, user, setError, usersInChan, adminFrom, show])



    useEffect((): void => {
        const checkIfBanned = async (usr: UserType): Promise<boolean> => {
            let banned: UserType[] = [];
            try {
                banned = await Request(
                    "GET",
                    {},
                    {},
                    "http://82.165.70.203:3000/chan/" + chan + "/banned"
                )
            } catch (error) {
                setError(error);
            }
            for (let i = 0; i < banned.length; i++) {
                if (banned[i].auth_id === usr.auth_id) {
                    return true;
                }
            }
            return false
        }

        const checkIfMuted = async (usr: UserType): Promise<boolean> => {
            let muted: UserType[] = [];
            try {
                muted = await Request(
                    "GET",
                    {},
                    {},
                    "http://82.165.70.203:3000/chan/" + chan + "/muted"
                )
            } catch (error) {
                setError(error);
            }
            for (let i = 0; i < muted.length; i++) {
                if (muted[i].auth_id === usr.auth_id) {
                    return true;
                }
            }
            return false
        }
        const adminUser = async (obj: any): Promise<void> => {
            if (await checkIfBanned(obj.user) || await checkIfMuted(obj.user)) {
                const err: ErrorType = {
                    statusCode: 400,
                    message: 'Error while setting user admin: Cant add admin if user is mute or ban'
                }
                setError(err);
                return ;
            }
            const res: AdminToChannelReceiveDto = {
                room: chan,
                auth_id: obj.user.auth_id,
                action: !obj.isAdmin }
            socket.emit('adminToChannel', res);
            /*
            const newArray: UsersChanAdminType[] = [];
            for (let index: number = 0; index < usersChan.length; index++) {
                if (usersChan[index].user?.auth_id === obj.user.auth_id) {
                    usersChan[index].isAdmin = !obj.isAdmin;
                }
                newArray.push(usersChan[index]);
            }
            setUsersChan(newArray);
             */
        }

        const listUserCards = async (): Promise<void> => {
            const ret: ReactNode[] = []

            for(let x: number = 0; x < usersChan.length; x++)
            {
                if (usersChan[x].user && usersChan[x].user?.auth_id !== user.auth_id)
                {
                    ret.push(
                        <div
                            key={x}
                            className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center">
                            <div
                                className="col-5 h-100 overflow-hidden buttons">
                                <button
                                    type="button"
                                    onClick={() => adminUser(usersChan[x])}>
                                    {
                                        usersChan[x].isAdmin ?
                                            <p>UNADMIN</p> :
                                            <p>ADMIN</p>
                                    }
                                </button>
                            </div>
                            <div
                                className="col-2 d-flex flex-row d-flex justify-content-center">
                                <input
                                    className={usersChan[x].user?.status ?
                                        "online" : "offline"}
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
    }, [chan, socket, user, setError, usersInChan, usersChan])

    const handleOpen = (): void => setShow(true);
    const handleClose = (): void => setShow(false);

    return (
        <div className="col-4 d-flex justify-content-end">
            <Modal show={show} id="ModalCode" onHide={handleClose}>
                <div className="p-4 pb-1">
                    <Modal.Header className="mb-3">
                        <h2>Set Admin users</h2>
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
            {
                isOwner ?
                    <button
                        className="col-6"
                        onClick={handleOpen}>
                        ADMIN
                    </button> :
                    <p></p>
            }
        </div>
    )
}
export default ModalAdminUser;
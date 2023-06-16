import { useEffect, useState } from "react";
import { useAuthData } from "../../contexts/AuthProviderContext";
import Request from './Requests';
import { io } from "socket.io-client";
import {BlockedUserReceiveDto, BlockedUserSendDto} from "../../dtos/blocked-user.dto";
import "../../styles/components/utils/userCards.css";

const socket = io('http://82.165.70.203:3000/update')

const BlockUnBlock = ({ auth_id }:{ auth_id : string }): JSX.Element => {
    const [status, setStatus] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { user, blockedList, updateBlockedList, setError } = useAuthData();
    //const socket = useContext(WebsocketContextUpdate);

    useEffect((): void => {
        const updateStatus = async (): Promise<void> => {
            if (auth_id !== undefined) {
                setLoading(true)
                try {
                    const res: boolean = await Request(
                        "GET",
                        {},
                        {},
                        "http://82.165.70.203:3000/user/" + auth_id + "/isblocked",
                    )
                    setStatus(res);
                    setLoading(false);
                    return ;
                } catch (error) {
                    setLoading(false);
                    setError(error);
                }
            }
        }
        updateStatus();
    }, [setError, auth_id, blockedList])

    useEffect(() => {
        const handleUpdateBlocked = (obj: BlockedUserSendDto, auth_id: string) => {
            if (user.auth_id === auth_id) {
                setStatus((prevState: boolean) => !prevState);
                updateBlockedList(obj.user, obj.action);
            }
        }
        socket.on('onUpdateBlocked', handleUpdateBlocked);
        return () => {
            socket.off('onUpdateBlocked', handleUpdateBlocked);
        }
    },[updateBlockedList, user, blockedList])

    const blockunblockUser = async (): Promise<void> => {
        const response: BlockedUserReceiveDto = {
            curid: user.auth_id,
            bloid: auth_id,
            action: !status,
        }
        socket.emit('updateBlocked', response)
    }

    return (
        <div>
            { loading? <p></p> :
            <button className="" onClick={blockunblockUser} >
                {  status ?
                            <p>UNBLOCK</p>
                            :
                            <p>BLOCK</p>
                }
            </button>
            }
        </div>
    )
}
export default BlockUnBlock;

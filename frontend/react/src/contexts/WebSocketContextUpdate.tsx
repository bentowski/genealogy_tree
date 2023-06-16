import { createContext } from 'react';
import io, { Socket } from 'socket.io-client';
import { WebsocketContext } from "./WebSocketContext";
export const socket = io('http://82.165.70.203:3000/update');
export const WebsocketContextUpdate = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
/*
export const WebsocketUpdateProvider = ({ children }:{ children:JSX.Element }) => {
    return <WebsocketContextUpdate.Provider value={socket}>{ children }</WebsocketContextUpdate.Provider>;
}
 */

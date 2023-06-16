import {useEffect, useState} from 'react';
import Request from "./Requests"
import { PartiesType } from "../../types";
import { useAuthData } from "../../contexts/AuthProviderContext";
import { io } from "socket.io-client";

const socket = io('http://82.165.70.203:3000/update')

function SearchBar({inputSelector, routeForRequest, parentCallBack}:{inputSelector: string, routeForRequest: string, parentCallBack: any}): JSX.Element {
	const [onload, setOnload] = useState<number>(0);
	const [value, setValue] = useState<string>('');
	const { setError } = useAuthData();
	//const socket = useContext(WebsocketContextUpdate);

	useEffect(() => {
		if (inputSelector === "MatchNav") {
			socket.on('onNewParty', () => {
				updateUrl()
			})
			return () => {
				socket.off('onNewParty');
			}
		}
	})

	const updateUrl = async (): Promise<void> => {
		// let input = document.querySelector("#MatchNav input") as HTMLInputElement;
		// let value = input.value;
		const url: string = "http://82.165.70.203:3000/" + routeForRequest + value;
		let parties: PartiesType[] = []
		try {
			parties = await Request(
				'GET',
				{},
				{},
				url
			);
		} catch (error) {
			setError(error);
		}
		parentCallBack(parties);
	}

	const requestUrl = async (event: any): Promise<void> => {
		setValue(event.target.value)
		const url: string = "http://82.165.70.203:3000/" + routeForRequest + event.target.value;
		let parties: PartiesType[] = [];
		try {
			parties = await Request(
				'GET',
				{},
				{},
				url
			);
		} catch (error) {
			setError(error);
		}
		parentCallBack(parties);
	}

	const onloadFct = async (): Promise<void> => {
		const url: string = "http://82.165.70.203:3000/" + routeForRequest;
		let parties: PartiesType[] = [];
		try {
			parties = await Request(
				'GET',
				{},
				{},
				url
			);
		} catch (error) {
			setError(error);
		}
		setOnload(1);
		parentCallBack(parties);
	}

	//const render = () => {
		if (onload === 0)
			onloadFct();
		return (
			<div className="SearchBar my-2">
				<p><input onChange={requestUrl} type= "text" placeholder="Search..." className="w-100" required/></p>
			</div>
		); // fin de return
	//} // fin de render
} // fin de App

export default SearchBar;

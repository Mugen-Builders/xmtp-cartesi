import React, { useState } from "react";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
import { Input, Button, Box, Text } from "@chakra-ui/react";

interface IInputProps {
	dappAddress: string;
}

export const SendInput: React.FC<IInputProps> = (props) => {
	const rollups = useRollups(props.dappAddress);
	const [input, setInput] = useState<string>("");
	const [destination, setDestination] = useState<string>("");

	const addInput = async (content: string, destination: string) => {
		if (rollups) {
			try {
				const jsonPayload = {
					type: "new",
					content: content,
					destination: destination
				};
				const jsonString = JSON.stringify(jsonPayload);
				let payload = ethers.utils.toUtf8Bytes(jsonString);
				await rollups.inputContract.addInput(props.dappAddress, payload);
			} catch (e) {
				console.log(`${e}`);
			}
		}
	};

	return (
		<Box>
			<Text as='b' fontSize='3xl' marginBottom='6'>✍🏼 Write a new proposal</Text>  
			<Input
				placeholder='Add details here'
				mb="2"
				mt="6"
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<Input
				placeholder='Add ethereum address to notify'
				mb="2"
				type="text"
				value={destination}
				onChange={(e) => setDestination(e.target.value)}
			/>
			<Button mt='2' onClick={() => addInput(input, destination)} disabled={!rollups}>
				Submit
			</Button>
		</Box>
	);
};

import { ethers } from "ethers";
import React, { useEffect } from "react";
import { useNoticesQuery } from "./generated/graphql";
import { Text, Card, CardBody, CardFooter } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

type Notice = {
	id: string;
	index: number;
	input: any,
	content: string,
};

export const Notices: React.FC = () => {
	const [result, reexecuteQuery] = useNoticesQuery();
	const { data, fetching, error } = result;

	useEffect(() => {
		reexecuteQuery({ requestPolicy: 'network-only' });
	}, [reexecuteQuery]);

	if (fetching) return <p>Loading...</p>;
	if (error) return <p>Oh no... {error.message}</p>;

	if (!data || !data.notices) return <p>No notices</p>;

	const notices: Notice[] = data.notices.edges.map((node: any) => {
		const n = node.node;
		let inputPayload = n?.input.payload;
		if (inputPayload) {
			try {
				inputPayload = ethers.utils.toUtf8String(inputPayload);
			} catch (e) {
				inputPayload = inputPayload + " (hex)";
			}
		} else {
			inputPayload = "(empty)";
		}
		let payload = n?.payload;
		let content = "(unknown)";
		if (payload) {
			payload = ethers.utils.toUtf8String(payload);
			try {
				const parsedPayload = JSON.parse(payload);
				content = parsedPayload.Payload || "(unknown)";
			} catch (e) {
				payload = payload + " (hex)";
			}
		} else {
			payload = "(empty)";
		}
		return {
			id: `${n?.id}`,
			index: parseInt(n?.index),
			content: content,
			input: n ? { index: n.input.index, payload: inputPayload } : {},
		};
	}).sort((a: Notice, b: Notice) => {
		if (b.input.index === a.input.index) {
			return b.index - a.index;
		} else {
			return b.input.index - a.input.index;
		}
	});

	return (
		<Box>
			<Button variant='ghost' onClick={() => reexecuteQuery({ requestPolicy: 'network-only' })}>
				🔃
			</Button>
			{notices.map((n: Notice) => (
				<Card width="100%" size='lg' direction='row' overflow='hidden' marginBottom='5' key={`${n.input.index}-${n.index}`}>
					<CardBody color={'grey'}>
						<Text> {n.content} </Text>
					</CardBody>
					<CardFooter>
						<Button mr='2'> 👍 </Button>
						<Button> 👎 </Button>
					</CardFooter>
				</Card>
			))}
		</Box>
	);
};

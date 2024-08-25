import { Box, Stack, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { FC } from "react";

export const Landing: FC = () => {
    return (
        <Box mt="20" alignContent="center">
					<Stack>
						<Heading>DAO-Example! 🗳️</Heading>
						<Text color="grey">
							Welcome to a simple DAO example that uses Cartesi for backend logic and XMTP to send messages!
						</Text>
					</Stack>
				</Box>
    );
};
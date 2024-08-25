import { FC } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "./config.json";
import { Button, Select, Box, Spacer } from "@chakra-ui/react";
import { Landing } from "./Landing";

const config: any = configFile;

export const Network: FC = () => {
	const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
	const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();

	return (
		<Box>
			{!wallet && (
				<Box>
					<Landing />
					<Button onClick={() => connect()}>
						{connecting ? "Connecting" : "Connect"}
					</Button>
				</Box>
			)}
			{wallet && (
				<Box display="flex" w="100%" ml="2" mt="2" alignItems="baseline">
					{settingChain ? (
						<span> Switching chain...</span>
					) : (
						<Select
							size="xs"
							width="auto"
							onChange={({ target: { value } }) => {
								if (config[value] !== undefined) {
									setChain({ chainId: value });
								} else {
									alert("No deploy on this chain");
								}
							}}
							value={connectedChain?.id}
						>
							{chains.map(({ id, label }) => (
								<option key={id} value={id}>
									{label}
								</option>
							))}
						</Select>
					)}
					<Spacer />
					<Box alignContent="right">
						<Button marginRight="20px" size="xs" onClick={() => disconnect(wallet)}>
							✂️ Disconnect Wallet
						</Button>
					</Box>
				</Box>
			)}
		</Box>
	);
};

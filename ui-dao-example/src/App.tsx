import { FC } from "react";
import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import { useState } from "react";
import { GraphQLProvider } from "./GraphQL";
import { Notices } from "./Notices";
import { SendInput } from "./Input";
import { Network } from "./Network";
import configFile from "./config.json";
import {Text, Input, Box, InputGroup, InputLeftAddon, Stack, SimpleGrid} from "@chakra-ui/react"

// Load configuration
const config: any = configFile;

// Initialize Web3Onboard
const injected: any = injectedModule();
init({
    wallets: [injected],
    chains: Object.entries(config).map(([k, v]: [string, any]) => ({id: k, token: v.token, label: v.label, rpcUrl: v.rpcUrl})),
    appMetadata: {
        name: "DAO-Example",
        icon: "<svg><svg/>",
        description: "Demo app for Cartesi-XMTP-Integration",
        recommendedInjectedWallets: [
            { name: "MetaMask", url: "https://metamask.io" },
        ],
    },
});

const App: FC = () => {
    const [dappAddress, setDappAddress] = useState<string>("0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e");

    return (
        <SimpleGrid columns={1} marginLeft={'25%'} marginRight={'25%'}>  
            <Network />
            <GraphQLProvider>
                <Stack>
                    <Box alignItems='baseline' marginLeft='2' mt='0'>
                        <InputGroup size='xs'>
                            <InputLeftAddon>
                                Dapp Address
                            </InputLeftAddon> 
                            <Input 
                                width='auto'
                                size='xs'
                                className="address-textbox"
                                type="text"
                                value={dappAddress}
                                onChange={(e) => setDappAddress(e.target.value)}
                            />
                        </InputGroup>
                        <br /><br />
                    </Box>
                </Stack>
                <br />
                
                <SendInput dappAddress={dappAddress} />
                <br /> <br />
                <Text as='b' fontSize='3xl'>🗳️ Active proposals</Text>
                <Notices />
            </GraphQLProvider>
        </SimpleGrid>
    );
};

export default App;

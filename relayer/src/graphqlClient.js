const { ApolloClient, InMemoryCache, ApolloProvider, gql } = require('@apollo/client');
const filterNotices = require('./controllers/graphql.controller');
require('dotenv').config();

/// @variable This is the url of a cartesi dApp subgraph as contained in the .env file.
const URI = process.env.URI;

/// @variable This is the interval in milliseconds at which the fetchAndSendLatestNotice function should be called.
const POOL_INTERVAL = process.env.POOL_INTERVAL;

/// @title fetchAndSendLatestNotice
/// @notice This function is a continues loop that periodically calls the graphql server based on the time interval specified in the .env file
async function fetchAndSendLatestNotice() {

    /// @notice Apollo SDK setup for an interaction client, it consimes the subgraph URI specified in the .env file
    const client = new ApolloClient({
        uri: URI,
        cache: new InMemoryCache(),
        fetch,
    });

    /// @notice Simplified query stucture to fetch all the notices from a Cartesi dApp graphql server
    const NOTICES_QUERY = gql`
            query notices {
            notices {
                edges {
                node {
                    index
                    input {
                    index
                    }
                    payload
                }
                }
            }
            }
    `;

    /// @notice Simple Interval loop that utilizes Apollo SDK to periodically fetch all the notices from a Cartesi dApp
    /// @notice Collected Notices are passed to the filterNotice function for further processing.
    setInterval(() => {
        client
            .query({
                query: NOTICES_QUERY,
                fetchPolicy: 'network-only',
            })
            .then(response => {
                const edges = response.data.notices.edges;
                filterNotices(edges);
            })
            .catch(error => {
                console.error('Polling error:', error);
            });
    }, POOL_INTERVAL);

}

module.exports = [fetchAndSendLatestNotice];
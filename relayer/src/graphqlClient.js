const { ApolloClient, InMemoryCache } = require('@apollo/client/core');
const { gql } = require('graphql-tag/src');
const filterNotices = require('./controllers/graphql.controller');
require('dotenv/lib/main').config();

const URI = process.env.URI;
const POOL_INTERVAL = process.env.POOL_INTERVAL;

async function fetchAndSendLatestNotice() {
    const client = new ApolloClient({
        uri: URI,
        cache: new InMemoryCache(),
        fetch,
    });

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
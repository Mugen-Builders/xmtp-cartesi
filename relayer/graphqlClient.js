import pkg from '@apollo/client';
const { ApolloClient, InMemoryCache, gql } = pkg;
import fetch from 'node-fetch';
import { sendNotice } from './xmtpClient.js';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql', // modify as per working environment
  cache: new InMemoryCache(),
  fetch,
});

const NOTICES_QUERY = gql`
  query notices($last: Int, $after: String) {
    notices(last: $last, after: $after) {
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

export async function fetchAndSendLatestNotice() {
  try {
    const { data } = await client.query({
      query: NOTICES_QUERY,
      variables: { last: 1 },
      fetchPolicy: 'no-cache'
    });

    const edges = data.notices.edges;
    if (edges.length > 0) {
      const latestNotice = edges[0].node;
      console.log('Latest Notice:', latestNotice);
      try{
        const response = await sendNotice(latestNotice);
        console.log("Notice sent response: ", response)
      }catch(e){
        console.log("error while sending notice: ", e)
      }
    } else {
      console.log('No notices found.');
    }
  } catch (error) {
    console.error('Error fetching notices:', error);
  }
}
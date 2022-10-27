import MainSearch from "./main-search";

import { ZDK, ZDKChain, ZDKNetwork } from "@zoralabs/zdk";

const networkInfo = {
  network: ZDKNetwork.Ethereum,
  chain: ZDKChain.Mainnet,
};

const API_ENDPOINT = "https://api.zora.co/graphql";
const args = {
  endPoint: API_ENDPOINT,
  networks: [networkInfo],
  apiKey: process.env.API_KEY,
};

const zdk = new ZDK(args); // All arguments are optional

export default async function Home() {
  const args = {
    token: {
      address: "0x8d04a8c79cEB0889Bdd12acdF3Fa9D207eD3Ff63",
      tokenId: "314",
    },
    includeFullDetails: false, // Optional, provides more data on the NFT such as all historical events
  };

  const response = await zdk.token(args);
  console.log(response.token);
  return (
    <div className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center">
      <MainSearch />
    </div>
  );
}

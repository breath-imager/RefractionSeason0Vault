import * as dotenv from 'dotenv';
import CollectionConfigInterface from '../lib/CollectionConfigInterface';
import { ethereumTestnet, ethereumMainnet } from '../lib/Networks';
import { openSea } from '../lib/Marketplaces';

const CollectionConfig: CollectionConfigInterface = {
  testnet: ethereumTestnet,
  mainnet: ethereumMainnet,
  // The contract name can be updated using the following command:
  // yarn rename-contract NEW_CONTRACT_NAME
  // Please DO NOT change it manually!
  contractName: 'RefractionSeason0Collection',
  tokenName: 'Refraction Season 0 Collection',
  tokenSymbol: 'RS0C',
  uri: "ipfs://QmWs1AmxYg8JW8p996saRQqk6qR5oXQffc62pvv9BoeSxN/",
  maxSupply: 707,
  contractAddress: "0x7F18ed518999Ce53a237d49f639679573d002bfa",
  marketplaceIdentifier: "refraction-season-0-collection",
  marketplaceConfig: openSea,
};

export default CollectionConfig;

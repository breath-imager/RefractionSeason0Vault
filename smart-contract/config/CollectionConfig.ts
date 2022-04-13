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
  uri: "ipfs://QmZbz6Xv637NaVcrFZgk9oWwiFE28mxyC7YEyT27M5xjt2/",
  maxSupply: 707,
  contractAddress: "0x70ec58eC3A2ad80300a81968753aee56EbDa89a1",
  marketplaceIdentifier: "refraction-season-0-collection",
  marketplaceConfig: openSea,
};

export default CollectionConfig;

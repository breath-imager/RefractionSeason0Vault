import * as dotenv from 'dotenv';
import CollectionConfigInterface from '../lib/CollectionConfigInterface';
import { ethereumTestnet, ethereumMainnet } from '../lib/Networks';
import { openSea } from '../lib/Marketplaces';
import whitelistAddresses from './whitelist.json';

const CollectionConfig: CollectionConfigInterface = {
  testnet: ethereumTestnet,
  mainnet: ethereumMainnet,
  // The contract name can be updated using the following command:
  // yarn rename-contract NEW_CONTRACT_NAME
  // Please DO NOT change it manually!
  contractName: 'RefractionSeason0Collection',
  tokenName: 'Refraction Season 0 Collection',
  tokenSymbol: 'RS0C',
  uriPrefix: "ipfs://QmVbbBDnVGQnEKcv8ZohAwSDVxbTmhNAjF5KcKCxLkYjqx/",
  maxSupply: 707,
  
  
  whitelistSale: {
    price: 0.202,
    maxMintAmountPerTx: 1,
  },
  preSale: {
    price: 0.202,
    maxMintAmountPerTx: 1,
  },
  publicSale: {
    price: 0.202,
    maxMintAmountPerTx: 1,
  },
  contractAddress: "0xbA1395e09fa53f75F6FcC16f004604a0015b8409",
  marketplaceIdentifier: "refraction-season-0-collection",
  marketplaceConfig: openSea,
  whitelistAddresses: whitelistAddresses,
};

export default CollectionConfig;

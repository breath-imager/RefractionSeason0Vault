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
  contractName: 'RefractionSeason0Vault',
  tokenName: 'Refraction Season 0 Vault',
  tokenSymbol: 'RS0V',
  hiddenMetadataUri: "ipfs://QmP1axuy8Rnb15oLxi4erfD81JkZ2fqMryKA4iUCVZuMzH/1.json",
  metadataUri: "ipfs://QmP1axuy8Rnb15oLxi4erfD81JkZ2fqMryKA4iUCVZuMzH/1.json",
  maxSupply: 707,
  maxPerWallet: 1,
  reserveSize: 0,
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
  contractAddress: "0x3e71094976dC7D9204C913C04a013882964aBCda",
  marketplaceIdentifier: "refraction-season-0-vault",
  marketplaceConfig: openSea,
  whitelistAddresses: whitelistAddresses,
};

export default CollectionConfig;

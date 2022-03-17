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
  contractName: 'RefractionSeason0Pass',
  tokenName: 'Refraction Season 0 Pass',
  tokenSymbol: 'RS0P',
  hiddenMetadataUri: "ipfs://QmfXHmqL3QLM5jz6VtykxfKyxDqPvqNR6pQwPAdrFgSpUm/1.json",
  metadataUri: "ipfs://QmfXHmqL3QLM5jz6VtykxfKyxDqPvqNR6pQwPAdrFgSpUm/1.json",
  maxSupply: 707,
  maxPerWallet: 1,
  reserveSize: 45,
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
  contractAddress: "0x649D94ef9c848bacB9A7aEf6653ce5D18E841e88",
  marketplaceIdentifier: "refraction-season-0-pass",
  marketplaceConfig: openSea,
  whitelistAddresses: whitelistAddresses,
};

export default CollectionConfig;

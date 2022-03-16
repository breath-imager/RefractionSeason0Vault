import NftContractProvider from '../lib/NftContractProvider';

async function main() {
  // Attach to deployed contract
  const contract = await NftContractProvider.getContract();
  
  // Disable whitelist sale (if needed)
  if (await contract.greenlistMintEnabled()) {
    console.log('Disabling whitelist sale...');

    await (await contract.setGreenlistMintEnabled(false)).wait();
  }

  console.log('Whitelist sale has been disabled!');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

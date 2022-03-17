import React from 'react';
import { ethers, BigNumber, utils } from 'ethers'
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from '@metamask/detect-provider';
import NftContractType from '../lib/NftContractType';
import CollectionConfig from '../../../../smart-contract/config/CollectionConfig';
import NetworkConfigInterface from '../../../../smart-contract/lib/NetworkConfigInterface';
import CollectionStatus from './CollectionStatus';
import MintWidget from './MintWidget';
import Whitelist from '../lib/Whitelist';

const ContractAbi = require('../../../../smart-contract/artifacts/contracts/' + CollectionConfig.contractName + '.sol/' + CollectionConfig.contractName + '.json').abi;

interface Props {
}

interface State {
  userAddress: string|null;
  network: ethers.providers.Network|null,
  networkConfig: NetworkConfigInterface,
  totalSupply: number;
  maxSupply: number;
  maxMintAmountPerTx: number;
  tokenPrice: BigNumber;
  isPaused: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  merkleProofManualAddress: string;
  merkleProofManualAddressFeedbackMessage: string|JSX.Element|null;
  errorMessage: string|JSX.Element|null,
}

const defaultState: State = {
  userAddress: null,
  network: null,
  networkConfig: CollectionConfig.mainnet,
  totalSupply: 0,
  maxSupply: 0,
  maxMintAmountPerTx: 0,
  tokenPrice: BigNumber.from(0),
  isPaused: true,
  isWhitelistMintEnabled: false,
  isUserInWhitelist: false,
  merkleProofManualAddress: '',
  merkleProofManualAddressFeedbackMessage: null,
  errorMessage: null,
};

export default class Dapp extends React.Component<Props, State> {
  provider!: Web3Provider;

  contract!: NftContractType;

  private merkleProofManualAddressInput!: HTMLInputElement;

  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  componentDidMount = async () => {
    const browserProvider = await detectEthereumProvider() as ExternalProvider;

    if (browserProvider?.isMetaMask !== true) {
      this.setError( 
        <>
          We were not able to detect <strong>MetaMask</strong>. We value <strong>privacy and security</strong> a lot so we limit the wallet options on the DAPP.<br />
          <br />
          But don't worry! <span className="emoji">😃</span> You can always interact with the smart-contract through <a href={this.generateContractUrl()} target="_blank">{this.state.networkConfig.blockExplorer.name}</a> and <strong>we do our best to provide you with the best user experience possible</strong>, even from there.<br />
          <br />
          You can also get your <strong>Greenlist Proof</strong> manually, using the tool below.
        </>,
      );
    }

    this.provider = new ethers.providers.Web3Provider(browserProvider);

    this.registerWalletEvents(browserProvider);

    await this.initWallet();
  }

  async mintTokens(amount: number): Promise<void>
  {
    try {
      await this.contract.mint(amount, {value: this.state.tokenPrice.mul(amount)});
    } catch (e) {
      this.setError(e);
    }
  }

  async whitelistMintTokens(amount: number): Promise<void>
  {
    try {
      await this.contract.greenlistMint(amount, Whitelist.getProofForAddress(this.state.userAddress!), {value: this.state.tokenPrice.mul(amount)});
    } catch (e) {
      this.setError(e);
    }
  }

  private isWalletConnected(): boolean
  {
    return this.state.userAddress !== null;
  }

  private isContractReady(): boolean
  {
    return this.contract !== undefined;
  }

  private isSoldOut(): boolean
  {
    return this.state.maxSupply !== 0 && this.state.totalSupply < this.state.maxSupply;
  }

  private isNotMainnet(): boolean
  {
    return this.state.network !== null && this.state.network.chainId !== CollectionConfig.mainnet.chainId;
  }

  private copyMerkleProofToClipboard(): void
  {
    const merkleProof = Whitelist.getRawProofForAddress(this.state.userAddress ?? this.state.merkleProofManualAddress);

    if (merkleProof.length < 1) {
      this.setState({
        merkleProofManualAddressFeedbackMessage: 'The given address is not in the greenlist, please double-check.',
      });

      return;
    }

    navigator.clipboard.writeText(merkleProof);

    this.setState({
      merkleProofManualAddressFeedbackMessage: 
      <>
        <strong>Congratulations!</strong> <span className="emoji">🎉</span><br />
        Your Merkle Proof <strong>has been copied to the clipboard</strong>. You can paste it into <a href={this.generateContractUrl()} target="_blank">{this.state.networkConfig.blockExplorer.name}</a> to claim your tokens.
      </>,
    });
  }

  render() {
    return (
  <>
  <a data-w-id="6a9b8e6c-30f6-5d01-b5c2-245bd7dba7f6" href="index.html" className="connect-wallet__back w-inline-block">
    <div className="back-link hide">Cancel</div><img src="/build/images/Refraction_Banner_Comparison-04.png" loading="lazy" sizes="100vw" srcSet="images/Refraction_Banner_Comparison-04-p-500.png 500w, images/Refraction_Banner_Comparison-04-p-800.png 800w, images/Refraction_Banner_Comparison-04-p-1080.png 1080w, images/Refraction_Banner_Comparison-04-p-1600.png 1600w, images/Refraction_Banner_Comparison-04.png 2084w" alt="" className="back-img"/>
  </a>
   <a data-w-id="0d9ff052-4310-ab31-e3a6-3ab802729022" href="index.html" className="wallet-ui mintpage hide w-inline-block">
    <div className="wallet-txt">
    {!this.isWalletConnected() || !this.isSoldOut() ?
      <div className="no-wallet  font-haas">
        {!this.isWalletConnected() ? 
          <button className="primary  font-haas" disabled={this.provider === undefined} onClick={() => this.connectWallet()}>Connect</button> : null}
      </div>
    : 
      <div className="wallet-txt">{this.state.userAddress}</div> } 
    </div>
    <div className="wallet-txt hide">LOGOUT</div><img src="/build/images/Refraction_Banner_Comparison-04.png" loading="lazy" sizes="100vw" srcSet="images/Refraction_Banner_Comparison-04-p-500.png 500w, images/Refraction_Banner_Comparison-04-p-800.png 800w, images/Refraction_Banner_Comparison-04-p-1080.png 1080w, images/Refraction_Banner_Comparison-04-p-1600.png 1600w, images/Refraction_Banner_Comparison-04.png 2084w" alt="" className="back-img"/>
  </a>
  <div className="mint-section">
    <div className="mint-window__wrapper">
      <div className="w-layout-grid grid-11">
        <div className="nft__wrapper"><img src="/build/images/Rectangle-3.png" loading="lazy" alt="" className="nft-art__img"/>
          <div className="wrap-horizontal hide">
            <div className="caption-med">View on OpenSea</div>
            <div className="caption-med">View on Etherscan</div>
          </div>
        </div>
        <div className="nft-content__wrapper">
          <div className="div-block-51">
            <div className="div-block-42">
              <h1 className="h5-med raygun">REFRACTION SEASON 0</h1>
            </div>
            <h2 className="h2-light">Title of NFT</h2>
            <p className="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.</p>
          </div>
          <div className="wrap-horizontal">
            <div className="mint-detail__wrapper">
              <h1 className="h2-light sm">{utils.formatEther(this.state.tokenPrice)}</h1><img src="/build/images/cib_ethereum.png" loading="lazy" alt="" className="image-18"/>
            </div>
            <div className="mint-detail__wrapper">
              <div className="progress-circle"></div>
              <p className="p nospace"><span className="text-span-14">{this.state.totalSupply}</span> of <span className="text-span-13">{this.state.maxSupply} </span><br/>NFTs have been minted.</p>
            </div>
          </div>
          <div className="wrap-horizontal desktophide">
            <div className="caption-med mobile">View on OpenSea</div>
            <div className="caption-med mobile">View on Etherscan</div>
          </div>
          <div className="div-block-50">
            <div className="div-block-48">
          {this.isNotMainnet() ?
          <div className="not-mainnet">
            You are not connected to the main network.
            <span className="small">Current network: <strong>{this.state.network?.name}</strong></span>
          </div>
          : null}
  
        {this.state.errorMessage ? <div className="error"><p>{this.state.errorMessage}</p><button onClick={() => this.setError()}>Close</button></div> : null}
        
        {this.isWalletConnected() ?
          <>
            {this.isContractReady() ?
              <>

               
                {this.state.totalSupply < this.state.maxSupply ?
                  <MintWidget
                    maxSupply={this.state.maxSupply}
                    totalSupply={this.state.totalSupply}
                    tokenPrice={this.state.tokenPrice}
                    maxMintAmountPerTx={this.state.maxMintAmountPerTx}
                    isPaused={this.state.isPaused}
                    isWhitelistMintEnabled={this.state.isWhitelistMintEnabled}
                    isUserInWhitelist={this.state.isUserInWhitelist}
                    mintTokens={(mintAmount) => this.mintTokens(mintAmount)}
                    whitelistMintTokens={(mintAmount) => this.whitelistMintTokens(mintAmount)}
                  />
                  :
                  <div className="collection-sold-out">
                    <h2>Tokens have been <strong>sold out</strong>! <span className="emoji">🥳</span></h2>

                    You can buy from our beloved holders on <a href={this.generateMarketplaceUrl()} target="_blank">{CollectionConfig.marketplaceConfig.name}</a>.
                  </div>
                }
              </>
              :
              <div className="collection-not-ready">
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>

                Loading collection data...
              </div>
            }
          </>
        : null}
              <a href="https://discord.com/invite/W7Zy2EFMP7" target="_blank" className="btn__primary long hide w-inline-block">
                <div className="btn-lottie__wrapper">
                  <div data-w-id="91b21c57-dbd7-0528-b5c9-e2c8e090a740" data-animation-type="lottie" data-src="documents/8793-loading.json" data-loop="1" data-direction="1" data-autoplay="1" data-is-ix2-target="0" data-renderer="canvas" data-default-duration="2" data-duration="0" className="lottie-animation-3"></div>
                </div>
                <div className="btn-child long"></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
   
    <a href="#" target="_blank" className="btn__txt hidedesktop mintpage w-inline-block">
      <div className="btn-text">Back to Refraction Festival<span className="ethersymbol"><strong></strong></span></div>
    </a>
  </div>
   </> );
  }



  private setError(error: any = null): void
  {
    let errorMessage = 'Unknown error...';

    if (null === error || typeof error === 'string') {
      errorMessage = error;
    } else if (typeof error === 'object') {
      // Support any type of error from the Web3 Provider...
      if (error?.error?.message !== undefined) {
        errorMessage = error.error.message;
      } else if (error?.data?.message !== undefined) {
        errorMessage = error.data.message;
      } else if (error?.message !== undefined) {
        errorMessage = error.message;
      } else if (React.isValidElement(error)) {
        this.setState({errorMessage: error});
  
        return;
      }
    }

    this.setState({
      errorMessage: null === errorMessage ? null : errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
    });
  }

  private generateContractUrl(): string
  {
    return this.state.networkConfig.blockExplorer.generateContractUrl(CollectionConfig.contractAddress!);
  }

  private generateMarketplaceUrl(): string
  {
    return CollectionConfig.marketplaceConfig.generateCollectionUrl(CollectionConfig.marketplaceIdentifier, !this.isNotMainnet());
  }

  private async connectWallet(): Promise<void>
  {
    try {
      await this.provider.provider.request!({ method: 'eth_requestAccounts' });

      this.initWallet();
    } catch (e) {
      this.setError(e);
    }
  }

  private async initWallet(): Promise<void>
  {
    const walletAccounts = await this.provider.listAccounts();
    
    this.setState(defaultState);

    if (walletAccounts.length === 0) {
      return;
    }

    const network = await this.provider.getNetwork();
    let networkConfig: NetworkConfigInterface;

    if (network.chainId === CollectionConfig.mainnet.chainId) {
      networkConfig = CollectionConfig.mainnet;
    } else if (network.chainId === CollectionConfig.testnet.chainId) {
      networkConfig = CollectionConfig.testnet;
    } else {
      this.setError('Unsupported network!');

      return;
    }
    
    this.setState({
      userAddress: walletAccounts[0],
      network,
      networkConfig,
    });

    if (await this.provider.getCode(CollectionConfig.contractAddress!) === '0x') {
      this.setError('Could not find the contract, are you connected to the right chain?');

      return;
    }

    this.contract = new ethers.Contract(
      CollectionConfig.contractAddress!,
      ContractAbi,
      this.provider.getSigner(),
    ) as unknown as NftContractType;

    this.setState({
      maxSupply: (await this.contract.maxSupply()).toNumber(),
      totalSupply: (await this.contract.totalMinted()).toNumber(),
      maxMintAmountPerTx: (await this.contract.maxMintAmountPerTx()).toNumber(),
      tokenPrice: await this.contract.cost(),
      isPaused: await this.contract.paused(),
      isWhitelistMintEnabled: await this.contract.greenlistMintEnabled(),
      isUserInWhitelist: Whitelist.contains(this.state.userAddress ?? ''),
    });
  }

  private registerWalletEvents(browserProvider: ExternalProvider): void
  {
    // @ts-ignore
    browserProvider.on('accountsChanged', () => {
      this.initWallet();
    });

    // @ts-ignore
    browserProvider.on('chainChanged', () => {
      window.location.reload();
    });
  }
}
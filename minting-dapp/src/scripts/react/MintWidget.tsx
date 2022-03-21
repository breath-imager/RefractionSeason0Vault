import { utils, BigNumber } from 'ethers';
import React from 'react';


let claimingNFT = false;

interface Props {
  maxSupply: number,
  totalSupply: number,
  tokenPrice: BigNumber,
  maxMintAmountPerTx: number,
  isPaused: boolean,
  isWhitelistMintEnabled: boolean,
  isUserInWhitelist: boolean,
  mintTokens(mintAmount: number): Promise<boolean>,
  whitelistMintTokens(mintAmount: number): Promise<boolean>,
}


interface State {
  mintAmount: number;
}

const defaultState: State = {
  mintAmount: 1,
};

export default class MintWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }


  

  private canMint(): boolean {
    return !this.props.isPaused || this.canWhitelistMint();
  }

  private canWhitelistMint(): boolean {
    return this.props.isWhitelistMintEnabled && this.props.isUserInWhitelist;
  }

  private incrementMintAmount(): void {
    this.setState({
      mintAmount: Math.min(this.props.maxMintAmountPerTx, this.state.mintAmount + 1),
    });
  }

  private decrementMintAmount(): void {
    this.setState({
      mintAmount: Math.max(1, this.state.mintAmount - 1),
    });
  }

  private async mint(): Promise<boolean> {
    if (!this.props.isPaused) {

      let result = await this.props.mintTokens(this.state.mintAmount);

      return result;
    }
  

    let result = this.props.whitelistMintTokens(this.state.mintAmount);
    return result;
  }

  render() {
    return (
      <>
        {this.canMint() ?

          <>
         
          <img className="btn__primary" src="/build/images/btn.png" onClick={() => this.mint()} />

       
        </>
          :
          <div className="cannot-mint">
            {this.props.isWhitelistMintEnabled ? <>You are not included in the <strong>greenlist</strong>.</> : <>The contract is <strong>paused</strong>.</>}<br />
            Please come back during the greenlist/public sale!
          </div>
        }
      </>
    );
  }
}
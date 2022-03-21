import React from 'react';

interface Props {
  userAddress: string|null;
  marketplaceURL: string;
  marketplaceName: string;
}


let targetUrl:string;

export default class SuccessPage extends React.Component<Props> {
  constructor(props: Props) {
    super(props);


  targetUrl = 'https://www.'+ this.props.marketplaceName +'.io/address/' + this.props.userAddress;

  }

 
  
  render() {
    return (
      <>       
 <div className="success-modal__wrapper">
    <div className="success-modal">
      <div className="modal-content__wrapper">
        <div className="fullcolumn-c">
          <div className="modal-art__wrapper">
             <div data-poster-url="https://uploads-ssl.webflow.com/61f62d1cc76f20840570a980/6232c352d8d3194987902235_REFRACTION_NFT_TEASER EDIT_v3_-poster-00001.jpg" data-video-urls="https://uploads-ssl.webflow.com/61f62d1cc76f20840570a980/6232c352d8d3194987902235_REFRACTION_NFT_TEASER EDIT_v3_-transcode.mp4,https://uploads-ssl.webflow.com/61f62d1cc76f20840570a980/6232c352d8d3194987902235_REFRACTION_NFT_TEASER EDIT_v3_-transcode.webm" data-autoplay="true" data-loop="true" data-wf-ignore="true" className="background-video-14 w-background-video w-background-video-atom">
                <video autoPlay loop muted playsInline data-wf-ignore="true" data-object-fit="cover">
                  <source src="https://uploads-ssl.webflow.com/61f62d1cc76f20840570a980/6232c352d8d3194987902235_REFRACTION_NFT_TEASER EDIT_v3_-transcode.mp4" data-wf-ignore="true"/>
                  <source src="https://uploads-ssl.webflow.com/61f62d1cc76f20840570a980/6232c352d8d3194987902235_REFRACTION_NFT_TEASER EDIT_v3_-transcode.webm" data-wf-ignore="true"/>
                    </video>
                  </div>
          <div className="nft-text__wrapper minttemplate">
            <h5 className="p align-c">You have minted (1) edition of </h5>
            <h3 className="h2-light align-l align-c">Season 0 Lanyard</h3>
            <a href="index.html" target="_blank" className="btn__txt nobox w-inline-block">
              <div className="btn-text nobox">Back to Refraction Festival<span className="ethersymbol"><strong></strong></span></div>
            </a>
          </div>
        </div>
        </div>
        <div className="fullcolumn-c">
          <div className="div-block-55">
            <h1 className="p">Now What?</h1>
            <h1 className="h4-light">Confirm the Status of Your Mint</h1>
            <p className="p">You met all the requirements for a successful mint, however it still needs to be confirmed on the blockchain. Several reasons for failure include supply running out before your mint transaction gets processed, not enough gas provided or network issues.</p>
            <a href="#" className="link-block-2 w-inline-block">
              <div className="text-block-18"><span className="text-span-19"><a href={targetUrl}  target="_blank">Check Status on {this.props.marketplaceName}</a></span></div>
            </a>
          </div>
          <div className="div-block-56">
            <div className="div-block-57">
              <div className="_80">
                <h1 className="h4-light">Collect Your Perks</h1>
                <p className="p">Thank you for your support at this early stage in Refraction’s journey. Please fill out this  form so we can notify you of upcoming events and future drops.</p>
              </div>
              <div className="btn__2 mintpage">
                <div className="btn-text">Contact Info Form<span className="ethersymbol"><strong></strong></span></div>
                <div className="btn-child-long"></div>
              </div>
            </div>
            <div>
              <div className="_80">
                <h1 className="h4-light">Join Your Community</h1>
                <p className="p">We’ve created a special section on our Discord that is private to NFT Holders. If you’d like to join the conversation and be looped in on all community programming, tap below!</p>
              </div>
              <div className="btn__primary mintpage align-l">
                <div className="btn-text">Join Discord<span className="ethersymbol"><strong></strong></span></div>
                <div className="btn-child-long"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</>
    );
  }
}
import  React, { Component }  from 'react'
import { determineScreenLoader } from "../index.js"
import './DocumentLoadingComponent.css'

// This component has logic to determine which loader view to render on app start
class DocumentLoadingComponent extends Component{
  constructor(){
    super();
    this.documentLoader = '';
    this.determineScreenLoader = determineScreenLoader;
  }
  componentWillMount(){
      this.documentLoader =  this.showMobileDeviceAlert() ;
  } 

  showMobileDeviceAlert(){
        return (
          <div className=" MobileDeviceAlert">
            <div className="ui container">
              <div className="ui grid">
                <div className="one column row">
                  <div className="column ">
                   <b> The adChain Registry dApp is not fully ready for mobile use.</b>
                    <br/><br/>You are able to view all the content, but token functionality is limited.
                    <div className="mt-25">
                         <button className="huge ui primary button" onClick={ () => this.determineScreenLoader(true) }>Continue</button>
                         <div className="mt-50"></div>
                         <a href='https://adtoken.com'><button className="medium ui button">Back to AdToken.com</button></a>
                    </div> 
                  </div>
                </div>
              </div>
              <div className="mt-100">
                <div className="ui grid">
                      <div className="m-25 f-16">
                          For full functionality, please access the site on a <b>Chrome <u>Desktop</u> Browser</b> with <b>MetaMask</b> extension installed.
                       <hr/>
                      </div>
                  <div className="two column row t-center mt-100">
                      <div className="column">
                        <div>
                          <img height="50" width="auto" src="../assets/ad_chain.png" alt="adChain"/>
                        </div>
                      </div>
                      <div className="column">
                          <img height="50" width="auto" src="../assets/adToken_logo_white.png" alt="adToken"/>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
  }
  render(){
    return (this.documentLoader)
  }
}

export default DocumentLoadingComponent;

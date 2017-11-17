import React, { Component } from 'react'
import adTokenLogo from './assets/ad_chain_logo_white_text.png'
import adChainLogo from './assets/adtoken_logo_white.png'
import store from 'store'

import './DocumentLoadingComponent.css'

// This component has logic to determine which loader view to render on app start
class DocumentLoadingComponent extends Component {
  constructor () {
    super()
    this.documentLoader = ''
  }
  componentWillMount () {
    this.documentLoader = this.showMobileDeviceAlert()
  }

  showMobileDeviceAlert () {
    return (
      <div className=' MobileDeviceAlert'>
        <div className='ui container'>
          <div className='ui grid'>
            <div className='one column row'>
              <div className='column '>
                <b> The adChain Registry dApp is not fully ready for mobile use.</b>
                <br /><br />All content is viewable, but token functionality is limited.
                    <div className='mt-25'>
                      <button className='huge ui primary button' onClick={() => this.isMobile()}>Continue</button>
                      <div className='mt-50' />
                      <a href='https://adtoken.com'><button className='medium ui button'>Back to adToken.com</button></a>
                    </div>
              </div>
            </div>
          </div>
          <div className='mt-50'>
            <div className='ui grid'>
              <div className='m-20 f-16'>
                  For full functionality, please access the site on a <b>Chrome <u>Desktop</u> Browser</b> with <b>MetaMask</b> extension installed.
                 <hr className='GreyDivider' />
              </div>
              <div className='two column row t-center mb-25'>
                <div className='column'>
                  <div>
                    <img height='50' width='auto' src={adTokenLogo} alt='adChain' />
                  </div>
                </div>
                <div className='column'>
                  <img height='50' width='auto' src={adChainLogo} alt='adToken' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  isMobile () {
    store.set('hasAcceptedMobile', 'true')
    window.location.reload()
  }

  render () {
    return (this.documentLoader)
  }
}

export default DocumentLoadingComponent

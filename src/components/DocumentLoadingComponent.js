import React, { Component } from 'react'
import { detect } from 'detect-browser'
import adTokenLogo from './assets/ad_chain_logo_white_text.png'
import adChainLogo from './assets/adtoken_logo_white.png'
import getToshiButton from './assets/get_toshi_button.png'
import store from 'store'

import './DocumentLoadingComponent.css'

// This component has logic to determine which loader view to render on app start
class DocumentLoadingComponent extends Component {
  constructor () {
    super()
    this.appLink = ''
    this.documentLoader = ''
    this.browser = detect()
  }

  componentWillMount () {
    this.appLink = this.getAppLink()
    this.documentLoader = this.showMobileDeviceAlert()
  }

  showMobileDeviceAlert () {
    return (
      <div className=' MobileDeviceAlert'>
        <div className='ui container'>
          <div className='ui grid'>
            <div className='one column row'>
              <div className='column '>
                <b> In order to interact with the adChain Registry, please download the Toshi Mobile Browser & Wallet App below:</b>
                <br /><br />
                <div className='mt-25'>
                  <a href={this.appLink}><img alt='Get Toshi' src={getToshiButton} height='60' /></a>
                  <div className='mt-25' />
                  or
                  </div>
              </div>
            </div>
          </div>
          <div className='mt-25'>
            <div className='ui grid'>
              <div className='m-20 f-16'>
                You can view the adChain Registry on your current mobile browser, but cannot interact using tokens.
              <br /><br />
                <button className='small ui primary button' onClick={() => this.isMobile()}>Continue</button>
                <div className='mt-25' />

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

  getAppLink () {
    // Handle the case where we don't detect the browser.
    // Detect user agent and use proper app ownload link.
    if (this.browser) {
      if (this.browser.name === 'ios' || this.browser.os === 'iOS') {
        return 'itms-apps://itunes.apple.com/us/app/toshi-ethereum-wallet/id1278383455'
      } else {
        return 'https://play.google.com/store/apps/details?id=org.toshi'
      }
    } else {
      return ''
    }
  }

  render () {
    return (this.documentLoader)
  }
}

export default DocumentLoadingComponent

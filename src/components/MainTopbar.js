import React, { Component } from 'react'
import commafy from 'commafy'
import store from '../store'
import registry from '../services/registry'
import token from '../services/token'

import Identicon from './Identicon'

import adtLogo from './assets/adtoken_logo.png'
import ethLogo from './assets/ethereum_purple_logo.png'

import './MainTopbar.css'

class MainTopbar extends Component {
  constructor () {
    super()

    this.state = {
      account: null,
      ethBalance: null,
      adtBalance: null,
      isLoading: true
    }

    setTimeout(() => {
      this.updateAddress()
      this.updateBalance()

      this.setState({
        isLoading: false
      })
    }, 250)
  }

  componentDidMount () {
    store.subscribe(x => {
      this.updateAddress()
      this.updateBalance()
    })
  }

  render () {
    const {
      adtBalance,
      ethBalance,
      address,
      isLoading
    } = this.state

    return (
      <div className='MainTopbar'>
        <div className='ui top attached menu stackable inverted overflow-x'>
          <div className='item'>
            {address ?
              <div className='AddressContainer'>
                <Identicon
                  address={address}
                  size={6}
                  scale={6} />
                <span>{address}</span>
              </div>
              : isLoading ? 'Loading...' : <div className='NoWalletMessage'>
               Please download or unlock <a href='https://metamask.io/' target='_blank' rel='noopener noreferrer'>MetaMask</a> extension to load application and Ethereum wallet
            </div>}
          </div>
          {address ?
            <div className='item'>
              <div>
                Network: <strong>Rinkeby Testnet</strong>
              </div>
            </div>
          : null}
          <div className='menu right'>
            {address ?
              <div className='item'>
                <div className='AdtLogo ui image'>
                  <img
                    src={adtLogo}
                    alt='ADT' />
                </div>
                {adtBalance !== null ? commafy(adtBalance) : '-'} ADT
              </div>
            : null}
            {address ?
              <div className='item'>
                <div className='EthLogo ui image'>
                  <img
                    src={ethLogo}
                    alt='ETH' />
                </div>
                {ethBalance !== null ? commafy(ethBalance) : '-'} ETH
              </div>
            : null}
            <div className='item'>
              <a
                title='Help'
                href='https://adchain.zendesk.com/hc/en-us'
                target='_blank'
                rel='noopener noreferrer'>
                <i className='icon help circle' /> Help
              </a>
            </div>
          </div>
        </div>

      </div>
    )
  }

  async updateAddress () {
    const address = await registry.getAccount()

    this.setState({
      address
    })
  }

  async updateBalance () {
    try {
      const adtBalance = await token.getBalance()

      this.setState({
        adtBalance: (adtBalance | 0) // coerce
      })
    } catch (error) {
      this.setState({
        adtBalance: null
      })
    }

    try {
      const ethBalance = await registry.getEthBalance()

      this.setState({
        ethBalance: ethBalance.toFixed(4)
      })
    } catch (error) {
      this.setState({
        ethBalance: null
      })
    }
  }
}

export default MainTopbar

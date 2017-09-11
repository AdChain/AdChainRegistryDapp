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
      account: registry.getAccount(),
      ethBalance: '-',
      adtBalance: '-'
    }

    this.updateBalance()
  }

  componentDidMount () {
    store.subscribe(x => {
      this.setState({
        account: registry.getAccount()
      })

      this.updateBalance()
    })
  }

  render () {
    const {
      adtBalance,
      ethBalance,
      account: address
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
              : <div className='NoWalletMessage'>
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
                {commafy(adtBalance)} ADT
              </div>
            : null}
            {address ?
              <div className='item'>
                <div className='EthLogo ui image'>
                  <img
                    src={ethLogo}
                    alt='ETH' />
                </div>
                {commafy(ethBalance)} ETH
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

  async updateBalance () {
    try {
      const adtBalance = await token.getBalance()

      this.setState({
        adtBalance: (adtBalance | 0) // coerce
      })
    } catch (error) {
      this.setState({
        adtBalance: '-'
      })
    }

    try {
      const ethBalance = await registry.getEthBalance()

      this.setState({
        ethBalance: ethBalance.toFixed(4)
      })
    } catch (error) {
      this.setState({
        ethBalance: '-'
      })
    }
  }
}

export default MainTopbar

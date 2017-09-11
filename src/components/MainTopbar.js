import React, { Component } from 'react'
import commafy from 'commafy'
import store from '../store'
import web3Service from '../services/web3'
import token from '../services/token'

import Identicon from './Identicon'

import adtLogo from './assets/adtoken_logo.png'

import './MainTopbar.css'

class MainTopbar extends Component {
  constructor () {
    super()

    this.state = {
      accounts: web3Service.accounts,
      adtBalance: '-'
    }

    this.updateBalance()
  }

  componentDidMount () {
    store.subscribe(x => {
      this.setState({
        accounts: web3Service.accounts
      })

      this.updateBalance()
    })
  }

  render () {
    const address = this.state.accounts[0]
    const adtBalance = this.state.adtBalance

    return (
      <div className='MainTopbar'>
        <div className='ui top attached menu stackable inverted'>
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
      const balance = await token.balanceOf(this.state.accounts[0])

      this.setState({
        adtBalance: balance | 0
      })
    } catch (error) {
      this.setState({
        adtBalance: '-'
      })
    }
  }
}

export default MainTopbar

import React, { Component } from 'react'
import commafy from 'commafy'
import store from '../store'
import web3Service from '../services/web3'

import Identicon from './Identicon'

import adtLogo from './assets/adtoken_logo.png'

import './MainTopbar.css'

const abi = require('../config/token.json').abi
const addr = '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd'

class MainTopbar extends Component {
  constructor () {
    super()

    this.state = {
      accounts: web3Service.accounts,
      adtBalance: 0
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
               Please download <a href='https://metamask.io/' target='_blank' rel='noopener noreferrer'>MetaMask</a> extension to load Ethereum wallet
            </div>}
          </div>
          <div className='menu right'>
            {address ?
              <div className='item'>
                <div className='AdtLogo ui image'>
                  <img
                    src={adtLogo}
                    alt='ADT' />
                </div>
                {commafy(adtBalance)}
              </div>
            : null}
          </div>
        </div>

      </div>
    )
  }

  updateBalance() {
    if (window.web3 && this.state.accounts.length) {
      const token = window.web3.eth.contract(abi).at(addr)
      token.balanceOf.call(this.state.accounts[0], (error, result) => {
        if (error) {
          return false
        }

        this.setState({
          adtBalance: result.toNumber()
        })
      })
    }
  }
}

export default MainTopbar

import React, { Component } from 'react'
import commafy from 'commafy'
import store from '../store'
import registry from '../services/registry'
import token from '../services/token'
import Identicon from './Identicon'
import moment from 'moment-timezone'

import adtLogo from './assets/adtoken_logo.png'
import ethLogo from './assets/ethereum_purple_logo.png'

import './MainTopbar.css'

class MainTopbar extends Component {
  constructor () {
    super()

    this.state = {
      address: null,
      account: null,
      ethBalance: null,
      adtBalance: null,
      isLoading: true,
      invalidNetwork: false
    }
  }

  componentDidMount () {
    this.updateAddress()
    this.updateBalance()
    this.updateNetwork()
    this.setState({
      isLoading: false
    })

    store.subscribe(x => {
      this.updateAddress()
      this.updateBalance()
      this.updateNetwork()
    })
  }

  render () {
    let {
      adtBalance,
      ethBalance,
      address,
      isLoading,
      invalidNetwork
    } = this.state

    return (
      <div className={'MainTopbar ' + (address ? '' : 'NoWallet')}>
        <div className='ui top attached menu stackable inverted overflow-x'>
          <div className='item'>
            {address
              ? <div className='AddressContainer'>
                <Identicon
                  address={address}
                  size={6}
                  scale={6} />
                <span>&nbsp;{address}</span>
              </div>
              : isLoading ? 'Loading...' : <div className='NoWalletMessage'>
               Please download or unlock <a href='https://metamask.io/' target='_blank' rel='noopener noreferrer'>MetaMask</a> extension to load application and Ethereum wallet
            </div>}
          </div>

          <div className='menu right'>
            {address
              ? <div className={'item ' + (invalidNetwork ? 'RedAlert' : '')}>
                <div>
                  {invalidNetwork
                    ? <strong>Please connect to Main Ethereum Network</strong>
                  : <span><strong>Network: </strong>Main Network</span>}
                </div>
              </div>
            : null}
            <div className='item TimeZone'>
              <div>
                <span>
                  <strong>Time Zone:</strong> &nbsp;&nbsp; {moment.tz(moment.tz.guess()).zoneAbbr()}
                </span>
              </div>
            </div>
            {address
              ? <div className={'item ' + (ethBalance === 0 || ethBalance === null ? 'RedAlert' : '')}>
                <div className='EthLogo ui image'>
                  <img
                    src={ethLogo}
                    alt='ETH' />
                </div>
                {ethBalance !== null ? commafy(ethBalance.toFixed(4)) : '-'} ETH
              {ethBalance === 0
                ? <span>&nbsp;(<a href='https://faucet.rinkeby.io/' target='_blank' rel='noopener noreferrer' className='AcquireLink'>Acquire ETH</a>)</span>
              : null}
              </div>
            : null}
            {address
              ? <div className={'item ' + (adtBalance === 0 || adtBalance === null ? 'RedAlert' : '')}>
                <div className='AdtLogo ui image'>
                  <img
                    src={adtLogo}
                    alt='ADT' />
                </div>
                {adtBalance !== null ? commafy(adtBalance) : '-'} ADT
              {adtBalance === 0
                ? <span>&nbsp;(<a href='https://faucet.adtoken.com' target='_blank' rel='noopener noreferrer' className='AcquireLink'>Acquire ADT</a>)</span>
              : null}
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
    const address = registry.getAccount()

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
        ethBalance: ethBalance.toNumber()
      })
    } catch (error) {
      this.setState({
        ethBalance: null
      })
    }
  }

  async updateNetwork () {
    const network = await registry.getNetwork()
    this.setState({
      invalidNetwork: (network.type !== 'main')
    })
  }
}

export default MainTopbar

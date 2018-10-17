import React, { Component } from 'react'
import commafy from 'commafy'
import store from '../../store'
import registry from '../../services/registry'
import token from '../../services/token'
import Identicon from '../Identicon'
// import moment from 'moment-timezone'
import { network } from '../../models/network'
import {renderAirSwap} from '../../utils/renderAirSwap'
import { Button } from 'semantic-ui-react'

import adtLogo from '../assets/adtoken_logo.png'
import ethLogo from '../assets/ethereum_purple_logo.png'
import _ from 'lodash'

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
                <span>&nbsp;<a href={`https://etherscan.io/address/${address}`} target='_blank' rel='noopener noreferrer'>{address.substr(0, 8) + '...' + address.substr(address.length - 4)}</a></span>
              </div>
              : isLoading ? 'Loading...' : <div className='NoWalletMessage'>
               Please download or unlock <a href='https://metamask.io/' target='_blank' rel='noopener noreferrer' style={{color: 'orange'}}>MetaMask</a> extension to load application and Ethereum wallet
              </div>}
          </div>

          <div className='menu right'>
            {address
              ? <div className={'item ' + (invalidNetwork ? 'RedAlert' : '')}>
                <div>
                  {invalidNetwork
                    ? <strong>Please connect to {_.capitalize(network)} Ethereum Network</strong>
                    : <span><strong>Network: </strong>{_.capitalize(network)} Ethereum Network</span>}
                </div>
              </div>
              : null}
            {
              // <div className='item TimeZone'>
              // <div>
              // <span>
              // <strong>Time Zone:</strong> &nbsp;&nbsp; {moment.tz(moment.tz.guess()).zoneAbbr()}
              // </span>
              // </div>
              // </div>
            }
            {address
              ? <div className={'JoyrideTopBar BalanceText item ' + (ethBalance === 0 || ethBalance === null ? 'RedAlert' : '')}>
                <div className='EthLogo ui image'>
                  <img
                    src={ethLogo}
                    alt='ETH' />
                </div>
                {ethBalance !== null ? commafy(ethBalance.toFixed(4)) : '-'} ETH
                <Button basic className='AcquireEthButton'><a href='https://metax.zendesk.com/hc/en-us/articles/360003417354' target='_blank' rel='noopener noreferrer' className='AcquireLink'>Purchase ETH</a></Button>
              </div>
              : null
            }
            {address
              ? <div className={'JoyrideTopBar BalanceText item ' + (adtBalance === 0 || adtBalance === null ? 'RedAlert' : '')}>
                <div className='AdtLogo ui image'>
                  <img
                    src={adtLogo}
                    alt='ADT' />
                </div>
                {adtBalance !== null ? commafy(adtBalance) : '-'} ADT
                <Button basic className='AcquireAdtButton' onClick={() => { renderAirSwap() }}>PURCHASE ADTOKEN</Button>
              </div>
              : null
            }
            <div className='item' />
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
    try{
      const fetchedNetwork = await registry.getNetwork()
      this.setState({
        invalidNetwork: (fetchedNetwork.type !== network)
      })
    }catch(error){
      console.log(error)
    }
  }
}

export default MainTopbar

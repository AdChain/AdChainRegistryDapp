import React, { Component } from 'react'
import commafy from 'commafy'
import { Dropdown } from 'semantic-ui-react'
import Tooltip from './Tooltip'
import priceStats from '../services/priceStats'
import toCurrency from '../utils/toCurrency'
import './AdtCalculator.css'

function formatValue (value) {
  return commafy(+(value).toFixed(5))
}

class AdtCalculator extends Component {
  constructor (props) {
    super()

    const ethUsd = 0
    const adtUsd = 0
    const adtEth = adtUsd / ethUsd
    const ethAdt = 1 / adtEth
    const usdEth = 1 / ethUsd
    const usdAdt = 1 / adtUsd

    const options = [{
      text: 'USD',
      value: 'usd'
    }, {
      text: 'ETH',
      value: 'eth'
    }, {
      text: 'ADT',
      value: 'adt'
    }]

    this.state = {
      options,
      selectedOption: 'usd',
      inputValue: 0,
      ethUsd,
      ethAdt,
      adtEth,
      adtUsd,
      usdEth,
      usdAdt,
      conversionUsd: 0,
      conversionEth: 0,
      conversionAdt: 0
    }

    this.calculate = this.calculate.bind(this)
    this.getPrices = this.getPrices.bind(this)

    this.getPrices()
  }

  componentWillUnmount () {
    this.clearTimeout()
  }

  render () {
    const {
      options,
      selectedOption,
      ethUsd,
      adtEth,
      adtUsd,
      conversionUsd,
      conversionEth,
      conversionAdt
    } = this.state

    return (
      <div className='AdtCalculator BoxFrame'>
        <span className='ui grid BoxFrameLabel'>ADTOKEN CALCULATOR <Tooltip info={'The adToken Calculator gives the user real-time conversion prices between USD, ETH, and ADT. The data is provided by coinmarketcap.com'} /></span>
        <div className='ui grid'>
          <div className='row'>
            <div className='column eight wide'>
              ETH/USD: <strong>{ethUsd ? toCurrency(ethUsd.toFixed(2)) : '-'}</strong>&nbsp;
              <Tooltip
                info='Price in USD for 1 ETH'
              />
            </div>
            <div className='column eight wide'>
              <div className='ui right labeled mini input'>
                <input
                  type='text'
                  placeholder='100'
                  defaultValue={''}
                  onInput={this.onInput.bind(this)}
                />
                <Dropdown
                  className='label AdtCalcDropdown'
                  value={selectedOption}
                  options={options}
                  onChange={this.onDropdownChange.bind(this)}
                />
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='column eight wide'>
              ADT/ETH: <strong>{adtUsd ? formatValue(adtEth) : '-'}Ξ</strong>&nbsp;
              <Tooltip
                info='Price in ETH for 1 ADT'
              />
            </div>
            <div className='column eight wide'>
              {selectedOption === 'eth' || selectedOption === 'adt' ? <span>Amount in USD: <strong>{toCurrency(conversionUsd)}</strong></span> : <span>Amount in ETH: <strong>{formatValue(conversionEth)}Ξ</strong></span>}
            </div>
          </div>
          <div className='row'>
            <div className='column eight wide'>
              ADT/USD: <strong>{adtUsd ? toCurrency(adtUsd.toFixed(4)) : '-'}</strong>&nbsp;
              <Tooltip
                info='Price in ADT for 1 USD'
              />
            </div>
            <div className='column eight wide'>
              {selectedOption === 'usd' || selectedOption === 'eth' ? <span>Amount in ADT: <strong>{formatValue(conversionAdt)}</strong></span> : <span>Amount in ETH: <strong>{formatValue(conversionEth)}</strong></span>}
            </div>
          </div>
          <a
            className='Source'
            href='https://coinmarketcap.com/'
            rel='noopener noreferrer'
            target='_blank'
          >coinmarketcap</a>
        </div>
      </div>
    )
  }

  onDropdownChange (event, {value}) {
    this.setState({
      selectedOption: value
    })

    setTimeout(() => this.calculate(), 0)
  }

  onInput (event) {
    event.preventDefault()

    const {target} = event
    let {value} = target

    if (!value) {
      value = 0
    }

    this.setState({
      inputValue: parseFloat(value, 10)
    })

    setTimeout(() => this.calculate(), 0)
  }

  calculate () {
    const {
      ethUsd,
      ethAdt,
      adtEth,
      adtUsd,
      usdEth,
      usdAdt,
      selectedOption,
      inputValue
    } = this.state

    if (selectedOption === 'usd') {
      this.setState({
        conversionEth: usdEth * inputValue,
        conversionAdt: usdAdt * inputValue
      })
    } else if (selectedOption === 'eth') {
      this.setState({
        conversionUsd: ethUsd * inputValue,
        conversionAdt: ethAdt * inputValue
      })
    } else if (selectedOption === 'adt') {
      this.setState({
        conversionUsd: adtUsd * inputValue,
        conversionEth: adtEth * inputValue
      })
    }
  }

  async getPrices () {
    const {ethUsd, adtUsd} = await priceStats()
    const adtEth = adtUsd / ethUsd
    const ethAdt = 1 / adtEth
    const usdEth = 1 / ethUsd
    const usdAdt = 1 / adtUsd

    this.setState({
      ethUsd,
      adtUsd,
      adtEth,
      ethAdt,
      usdEth,
      usdAdt
    })

    this.clearTimeout()
    this.pricesTimeout = setTimeout(() => this.getPrices(), 25e3)
  }

  clearTimeout () {
    if (this.pricesTimeout) {
      window.clearTimeout(this.pricesTimeout)
    }
  }
}

export default AdtCalculator

import React, { Component } from 'react'
import commafy from 'commafy'
import {Dropdown} from 'semantic-ui-react'

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

  getPrices () {
    priceStats()
    .then(({ethUsd, adtUsd}) => {
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
        usdAdt,
      })

      setTimeout(() => this.getPrices(), 25e3)
    })
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
        <div className='ui grid'>
          <div className='row'>
            <div className='column seven wide'>
              ETH/USD: {ethUsd ? toCurrency(ethUsd) : '-'}
            </div>
            <div className='column nine wide'>
              <div className='ui right labeled mini input'>
                <input
                  type='text'
                  placeholder='100'
                  defaultValue={''}
                  onInput={this.onInput.bind(this)}
                />
                <Dropdown
                  className='label blue'
                  value={selectedOption}
                  options={options}
                  onChange={this.onDropdownChange.bind(this)}
                />
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='column seven wide'>
              ADT/ETH: {adtUsd ? formatValue(adtEth) : '-'}Ξ
            </div>
            <div className='column nine wide'>
              {selectedOption === 'eth' || selectedOption === 'adt' ? <span>Amount in USD: {toCurrency(conversionUsd)}</span> : <span>Amount in ETH: {formatValue(conversionEth)}Ξ</span>}
            </div>
          </div>
          <div className='row'>
            <div className='column seven wide'>
              ADT/USD: {adtUsd ? toCurrency(adtUsd) : '-'}
            </div>
            <div className='column nine wide'>
              {selectedOption === 'usd' || selectedOption === 'eth' ? <span>Amount in ADT: {formatValue(conversionAdt)}</span> : <span>Amount in ETH: {formatValue(conversionEth)}</span>}
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
}

export default AdtCalculator

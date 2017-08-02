import React, { Component } from 'react'
import commafy from 'commafy'

import toCurrency from '../utils/toCurrency'

import './AdtCalculator.css'

class AdtCalculator extends Component {
  render () {
    const usdEth = 34231
    const ethAdt = 35443
    const usdAdt = 45632

    const conversionEth = null
    const conversionAdt = null

    return (
      <div className='AdtCalculator BoxFrame'>
        <div className='ui grid stackable'>
          <div className='row'>
            <div className='column eight wide'>
              USD/ETHER: {commafy(usdEth)}
            </div>
            <div className='column eight wide'>
              <div className='ui right labeled mini input'>
                <input type='text' placeholder='100' />
                <div className='ui dropdown label blue'>
                  <div className='text'>USD</div>
                  <i className='dropdown icon' />
                  <div className='menu'>
                    <div className='item'>USD</div>
                    <div className='item'>ETH</div>
                    <div className='item'>ADT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='column eight wide'>
              ETHER/ADT: {commafy(ethAdt)}Ξ
            </div>
            <div className='column eight wide'>
              Amount in ETH: {commafy(conversionEth)}
            </div>
          </div>
          <div className='row'>
            <div className='column eight wide'>
              USD/ADT: {toCurrency(usdAdt)}
            </div>
            <div className='column eight wide'>
              Amount in ADT: {commafy(conversionAdt)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AdtCalculator

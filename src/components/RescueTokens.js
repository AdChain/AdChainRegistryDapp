import React, {Component} from 'react'
import Tooltip from './Tooltip'
// import registry from '../services/registry'
// import toastr from 'toastr'

class RescueTokens extends Component {
  render () {
    return (
      <div className='BoxFrame RescueTokens mt-25'>
        <span className='BoxFrameLabel ui grid'>RescueTokens <Tooltip info='Get tokens back' /></span>
        <div className='ui grid'>
          <div className='row'>
            <div className='column sixteen'>
              <button className='ui mini button red' onClick={() => { this.rescueTokens() }}>RESCUE</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  async rescueTokens () {
  //   let domains = await (await window.fetch(`http://adchain-registry-api-staging.metax.io/registry/domains?account=${this.props.account}`)).json()
  //   domains.map(async x => {

  //   })
    console.log('hit ')
  }
}

export default RescueTokens

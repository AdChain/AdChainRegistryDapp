import React, {Component} from 'react'
import Tooltip from './Tooltip'
// import registry from '../services/registry'
// import toastr from 'toastr'

class RescueTokens extends Component {
  render () {
    return (

      <div className='column five wide t-center'>
        <div>
          Expired Voting ADT <Tooltip class='InfoIconHigh' info={'These tokens are expired'} />
        </div>
        <span className='VotingTokensAmount'>0 ADT</span>
        <br />
        <button className='ui tiny button green' onClick={() => { this.rescueTokens() }}>RESCUE</button>
      </div>
    )
  }

  async rescueTokens () {
    let domains = await (await window.fetch(`http://adchain-registry-api-staging.metax.io/registry/domains?account=${this.props.account}`)).json()
    domains.map(async x => {

    })
    console.log('hit')
  }
}

export default RescueTokens

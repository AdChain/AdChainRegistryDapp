import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'

import token from '../services/token'
import './RegistryStatsbar.css'

class RegistryStatsbar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showHeader: props.showHeader,
      totalStaked: null,
      totalInApplication: null,
      totalInCommit: null,
      totalInReveal: null,
      totalInRegistry: null
    }

    this.fetchStats()
  }

  render () {
    const {
      totalStaked,
      totalInApplication,
      totalInCommit,
      totalInReveal,
      totalInRegistry
    } = this.state
    const {showHeader} = this.state

    return (
      <div className='RegistryStatsbar BoxFrame'>
        <div className='ui grid stackable'>
          {showHeader ?
            <div className='column sixteen wide'>
              <div className='ui large header'>
                Registry Status
              </div>
            </div>
          : null}
          <div className='column sixteen wide'>
            <div className='ui mini statistics'>
              <div className='statistic'>
                <div className='value'>
                  {totalStaked != null ? commafy(totalStaked) : '-'}
                </div>
                <div className='label'>
                  TOTAL ADT STAKED
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInApplication != null ? commafy(totalInApplication) : '-'}
                </div>
                <div className='label'>
                  IN APPLICATION
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInCommit != null ? commafy(totalInCommit) : '-'}
                </div>
                <div className='label'>
                IN VOTING
                COMMIT
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInReveal != null ? commafy(totalInReveal) : '-'}
                </div>
                <div className='label'>
                  IN VOTING
                  REVEAL
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInRegistry != null ? commafy(totalInRegistry) : '-'}
                </div>
                <div className='label'>
                  IN REGISTRY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  async fetchStats () {
    let totalStaked = await (await window.fetch(`https://adchain-registry-api.metax.io/registry/domains/stake/count`)).json()
    const totalInApplication = await (await window.fetch(`https://adchain-registry-api.metax.io/registry/domains/application/count`)).json()
    const totalInCommit = await (await window.fetch(`https://adchain-registry-api.metax.io/registry/domains/incommit/count`)).json()
    const totalInReveal = await (await window.fetch(`https://adchain-registry-api.metax.io/registry/domains/inreveal/count`)).json()
    const totalInRegistry = await (await window.fetch(`https://adchain-registry-api.metax.io/registry/domains/registry/count`)).json()

    if (totalStaked) {
      totalStaked = totalStaked / Math.pow(10, token.decimals)
    }

    this.setState({
      totalStaked,
      totalInApplication,
      totalInCommit,
      totalInReveal,
      totalInRegistry
    })
  }
}

RegistryStatsbar.propTypes = {
  showHeader: PropTypes.bool
}

export default RegistryStatsbar

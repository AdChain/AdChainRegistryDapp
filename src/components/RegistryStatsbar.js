import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import { Popup } from 'semantic-ui-react'

import store from '../store'
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

  componentDidMount () {
    this._isMounted = true

    this.fetchStats()
    store.subscribe(x => {
      this.fetchStats()
    })
  }

  componentWillUnmount () {
    this._isMounted = false
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
          {showHeader
            ? <div className='column sixteen wide'>
              <div className='ui large header'>
                Registry Status
              </div>
            </div>
          : null}
          <div className='column sixteen wide'>
            <span className='ui grid BoxFrameLabel'>GLOBAL REGISTRY USAGE</span>
            <div className='ui mini statistics'>
              <div className='statistic'>
                <div className='value'>
                  {totalStaked != null ? commafy(totalStaked) : '-'}
                </div>
                <div className='label'>
                  TOTAL ADT STAKED&nbsp;
                  <Popup
                    trigger={<i className='icon info circle' />}
                    content='Total amount of adToken deposited when applying and challenging'
                  />
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInApplication != null ? commafy(totalInApplication) : '-'}
                </div>
                <div className='label'>
                  IN APPLICATION&nbsp;
                  <Popup
                    trigger={<i className='icon info circle' />}
                    content='Total number of domains currently in application stage'
                  />
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInCommit != null ? commafy(totalInCommit) : '-'}
                </div>
                <div className='label'>
                  IN VOTING COMMIT&nbsp;
                  <Popup
                    trigger={<i className='icon info circle' />}
                    content='Total number of domains currently in voting commit stage'
                  />
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInReveal != null ? commafy(totalInReveal) : '-'}
                </div>
                <div className='label'>
                  IN VOTING REVEAL&nbsp;
                  <Popup
                    trigger={<i className='icon info circle' />}
                    content='Total number of domains currently in voting reveal stage'
                  />
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInRegistry != null ? commafy(totalInRegistry) : '-'}
                </div>
                <div className='label'>
                  IN REGISTRY&nbsp;
                  <Popup
                    trigger={<i className='icon info circle' />}
                    content='Total number of domains currently accepted into the adChain Registry'
                  />
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

    if (this._isMounted) {
      this.setState({
        totalStaked,
        totalInApplication,
        totalInCommit,
        totalInReveal,
        totalInRegistry
      })
    }
  }
}

RegistryStatsbar.propTypes = {
  showHeader: PropTypes.bool
}

export default RegistryStatsbar

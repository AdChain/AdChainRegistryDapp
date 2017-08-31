import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'

import './RegistryStatsbar.css'

class RegistryStatsbar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showHeader: props.showHeader
    }
  }
  render () {
    const totalAdtStaked = null
    const totalInApplication = null
    const totalInCommit = null
    const totalInReveal = null
    const totalInRegistry = null
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
                  {totalAdtStaked ? commafy(totalAdtStaked) : '-'}
                </div>
                <div className='label'>
                  TOTAL ADT STAKED
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInApplication ? commafy(totalInApplication) : '-'}
                </div>
                <div className='label'>
                  IN APPLICATION
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInCommit ? commafy(totalInCommit) : '-'}
                </div>
                <div className='label'>
                IN VOTING
                COMMIT
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInReveal ? commafy(totalInReveal) : '-'}
                </div>
                <div className='label'>
                  IN VOTING
                  REVEAL
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {totalInRegistry ? commafy(totalInRegistry) : '-'}
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
}

RegistryStatsbar.propTypes = {
  showHeader: PropTypes.bool
}

export default RegistryStatsbar

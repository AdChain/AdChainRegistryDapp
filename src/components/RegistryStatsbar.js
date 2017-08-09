import React, { Component } from 'react'
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
    const totalAdtStaked = 3243
    const totalInApplication = 5432
    const totalInCommit = 7489
    const totalInReveal = 923
    const totalInRegistry = 82311
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
                  {commafy(totalAdtStaked)}
                </div>
                <div className='label'>
                  TOTAL ADT STAKED
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {commafy(totalInApplication)}
                </div>
                <div className='label'>
                  IN APPLICATION
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {commafy(totalInCommit)}
                </div>
                <div className='label'>
                IN VOTING
                COMMIT
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {commafy(totalInReveal)}
                </div>
                <div className='label'>
                  IN VOTING
                  REVEAL
                </div>
              </div>
              <div className='statistic'>
                <div className='value'>
                  {commafy(totalInRegistry)}
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

export default RegistryStatsbar

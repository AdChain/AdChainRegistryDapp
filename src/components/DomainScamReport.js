import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'get-prop'
import { Loader } from 'semantic-ui-react'

import './DomainScamReport.css'

function item (x) {
  return <div className='DomainScamReportListItem' key={Math.random()}><label>{x.key}</label> <span className={x.flag}><i className={`icon ${x.flag === 'safe' ? 'check circle' : 'warning sign'}`}></i>{x.value}</span></div>
}

class DomainScamReport extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      report: null,
      isLoading: true
    }
  }

  componentDidMount () {
    this._isMounted = true
    this.fetchStats()
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      domain,
      report,
      isLoading
    } = this.state

    return (
      <div className='DomainScamReport BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui header'>
              Domain Report
            </div>
          </div>
          {isLoading ?
            <div className='column sixteen wide center aligned'>
              <Loader indeterminate active inline />
            </div>
          :
          report ?
            <div className='column sixteen wide DomainScamReportList'>
              {item(get(report, 'verdict'))}
              <div className='ui divider'></div>
              <div className='ListSubSection'>
                {get(report, 'verdict.report').slice(1, 6).map(x => {
                  return item(x)
                })}
              </div>
              <div className='ui divider'></div>
              {item(get(report, 'wot'))}
              <div className='ui divider'></div>
              {item(get(report, 'blacklist'))}
              <div className='ListSubSection'>
                {get(report, 'blacklist.report').filter(x => x.key).map(x => {
                  return item(x)
                })}
              </div>
              <div className='ui divider'></div>
              {item(get(report, 'creation'))}
            </div>
            : <div>Error fetching report</div>}
          <div className='Source'>
            <a
              href={`https://www.scamvoid.com/check/${domain}`}
              target='_blank'
              rel='noopener noreferrer'>
              <span>source: </span>
              Scamvoid
            </a>
          </div>
        </div>
      </div>
    )
  }

  async fetchStats () {
    const {domain} = this.state

    const response = await window.fetch(`https://adchain-registry-api.metax.io/stats/domain?domain=${domain}`)
    const data = await response.json()

    if (this._isMounted) {
      if (data.stats) {
        const report = data.stats.scamvoid
        this.setState({
          report,
          isLoading: false
        })
      }
    }
  }
}

DomainScamReport.propTypes = {
  domain: PropTypes.string
}

export default DomainScamReport

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'get-prop'
import { Loader } from 'semantic-ui-react'
import { registryApiURL } from '../../models/urls'

import './DomainScamReport.css'

function item (x) {
  return <div className='DomainScamReportListItem' key={Math.random()}><label>{x.key}</label> <span className={x.flag}><i className={`icon ${x.flag === 'safe' ? 'check circle' : 'warning sign'}`} />
    {x.link
      ? <a
        href={x.link}
        target='_blank'
        rel='noopener noreferrer'>
        {x.value}
        <i className='icon external tiny' />
      </a>
      : x.value}
  </span></div>
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
          {isLoading
            ? <div className='column sixteen wide center aligned'>
              <Loader indeterminate active inline />
            </div>
            : report
              ? report.verdict.value
                ? <div className='column sixteen wide DomainScamReportList'>
                  {item(get(report, 'blacklist'))}
                  <div className='ListSubSection'>
                    {get(report, 'blacklist.report').filter(x => x.key && x.flag).map(x => {
                      return item(x)
                    })}
                  </div>
                  <div className='ui divider' />
                  {item(get(report, 'popularity'))}
                  <div className='ui divider' />
                  {item(get(report, 'creation'))}
                </div>
                : <div className='column sixteen wide center aligned'>
                  <div className='ui message warning'><i className='icon warning sign' /> Report for this domain was not found.</div>
                </div>
              : <div className='column sixteen wide center aligned'>
                <div className='ui message default'>Error fetching report</div>
              </div>}
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

    const options = {
      mode: 'cors',
      cache: 'no-cache'
    }

    const response = await window.fetch(`${registryApiURL}/stats/domain?domain=${domain}&filter=scamvoid`, options)
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

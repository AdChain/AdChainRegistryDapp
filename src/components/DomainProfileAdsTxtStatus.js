import React, { Component } from 'react'

import './DomainProfileAdsTxtStatus.css'
import GreenCheck from './assets/green_check.svg'
import RedX from './assets/red_x.svg'

class DomainProfileAdsTxtStatus extends Component {
  constructor (props) {
    super()

    const {
      domain
    } = props

    this.state = {
      domain,
      adsTxtStatus: null
    }
  }

  componentDidMount () {
    this._isMounted = true
    this.fetchAdsTxtStatus()
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {adsTxtStatus} = this.state

    return (
      <div className='DomainProfileAdsTxtStatus BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='Header'>
              Ads.txt Plus Status
            </div>
          </div>
          <div className='AdsTxtStatus'>
            Registered on Ads.txt Plus:
            {
              (adsTxtStatus) ? <div className='InAdsTxt'><span>&nbsp; YES &nbsp;</span><img src={GreenCheck} alt='greenCheck' /></div> : <div className='NotInAdsTxt'><span>&nbsp; NO &nbsp;</span><img src={RedX} alt='redX' /></div>
            }
          </div>
        </div>
      </div>
    )
  }

  async fetchAdsTxtStatus () {
    const {domain} = this.state

    const options = {
      mode: 'cors',
      cache: 'no-cache'
    }

    const adsTxtStatus = await (await window.fetch(`https://dls-api.adchain.com/domainconfirmation?domain=${domain}`, options)).json()

    if (this._isMounted) {
      if (adsTxtStatus.success) {
        this.setState({
          adsTxtStatus: true
        })
      } else {
        this.setState({
          adsTxtStatus: false
        })
      }
    }
  }
}

export default DomainProfileAdsTxtStatus

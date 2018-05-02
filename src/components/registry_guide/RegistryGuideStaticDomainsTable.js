import React, { Component } from 'react'
import DomainsTableInApplication from '../assets/domainstable_inapplication.png'
import DomainsTableInCommit from '../assets/domainstable_incommit.png'
import DomainsTableInReveal from '../assets/domainstable_inreveal.png'
import './RegistryGuideStaticDomainsTable.css'

const domainTables = {
  DomainsTableInApplication,
  DomainsTableInCommit,
  DomainsTableInReveal
}

class RegistryGuideStaticDomainsTable extends Component {
  constructor (props) {
    super()
    this.state = {
      source: props.source
    }
  }

  render () {
    const { source } = this.state
    let imgSrc
    
    switch (source) {
      case 'application':
        imgSrc = domainTables.DomainsTableInApplication
        break
      case 'commit':
        imgSrc = domainTables.DomainsTableInCommit
        break
      case 'reveal':
        imgSrc = domainTables.DomainsTableInReveal
        break
      default:
        imgSrc = domainTables.DomainsTableInApplication
        break
    }

    return (
      <div className='RegistryGuideStaticDomainsTable BoxFrame'>
        <div className='ui grid stackable'>
          <div className='GuideText'>
            <img src={imgSrc} alt='domainTableImage' />
          </div>
        </div>
      </div>
    )
  }
}

export default RegistryGuideStaticDomainsTable

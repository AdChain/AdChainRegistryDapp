import React from 'react'
import ReactDisqusThread from 'react-disqus-thread'

import './DomainProfileComments.css'

function DomainProfileComments (props) {
  const {domain} = props

  return (
    <div className='DomainProfileComments BoxFrame'>
      <ReactDisqusThread
        shortname='adchain'
        identifier={domain}
        title={domain}
        url={`https://app.adchain.com/profile/${domain}`} />
    </div>
  )
}

export default DomainProfileComments

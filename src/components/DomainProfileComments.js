import React from 'react'
import PropTypes from 'prop-types'
import ReactDisqusThread from 'react-disqus-thread'

import './DomainProfileComments.css'

function DomainProfileComments (props) {
  const {domain} = props

  const comments = (<div className='DomainProfileComments'>
      <ReactDisqusThread
        shortname='adchain'
        identifier={domain}
        title={domain}
        url={`https://app.adchain.com/domains/${domain}`} />
    </div>)

  return (comments)
}

DomainProfileComments.propTypes = {
  domain: PropTypes.string
}

export default DomainProfileComments

import React from 'react'
import PropTypes from 'prop-types'
import Disqus from 'react-disqus-comments'

import './DomainProfileComments.css'

function DomainProfileComments (props) {
  const {domain} = props

  const comments = (<div className='DomainProfileComments'>
    <Disqus
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

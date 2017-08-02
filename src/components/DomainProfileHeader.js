import React from 'react'

import './DomainProfileHeader.css'

function DomainProfileHeader (props) {
  const {domain, name, location} = props

  return (
    <div className='DomainProfileHeader BoxFrame'>
    {domain}
    </div>
  )
}

export default DomainProfileHeader

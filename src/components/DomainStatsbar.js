import React from 'react'
import commafy from 'commafy'

import './DomainStatsbar.css'

function DomainStatsbar (props) {
  const monthlyVisits = (props.monthlyVisits | 0) // coerce
  const bounceRate = props.bounceRate || 0
  const avgVisitDuration = props.avgVisitDuration || 0
  const category = props.category || '<unknown>'
  const pagesPerVisit = (props.pagePerVisit | 0)

  return (
    <div className='DomainStatsbar BoxFrame'>
      <div className='ui grid stackable'>
        <div className='row'>
          <div className='column eight wide'>
            Monthly Visits: {commafy(monthlyVisits)}
          </div>
          <div className='column eight wide'>
            Bounce Rate: {bounceRate}%
          </div>
        </div>
        <div className='row'>
          <div className='column eight wide'>
            Avg. Visit Duration: {avgVisitDuration}
          </div>
          <div className='column eight wide'>
            Category: {category}
          </div>
        </div>
        <div className='row'>
          <div className='column eight wide'>
            Pages per Visit: {commafy(pagesPerVisit)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DomainStatsbar

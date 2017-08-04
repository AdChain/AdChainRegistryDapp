import React from 'react'
import commafy from 'commafy'

import './DomainStatsbar.css'

function DomainStatsbar (props) {
/*
  const monthlyVisits = (props.monthlyVisits | 0) // coerce
  const bounceRate = props.bounceRate || 0
  const avgVisitDuration = props.avgVisitDuration || 0
  const category = props.category || '<unknown>'
  const pagesPerVisit = (props.pagePerVisit | 0)
  */

  const monthlyVisits = 34558
  const bounceRate = 88
  const avgVisitDuration = '00:17:01'
  const category = 'Lifestyle'
  const pagesPerVisit = 345

  return (
    <div className='DomainStatsbar BoxFrame'>
      <div className='ui grid stackable'>
        <div className='row'>
          <div className='column eight wide'>
            Monthly Visits: <strong>{commafy(monthlyVisits)}</strong>
          </div>
          <div className='column eight wide'>
            Bounce Rate: <strong>{bounceRate}%</strong>
          </div>
        </div>
        <div className='row'>
          <div className='column eight wide'>
            Avg. Visit Duration: <strong>{avgVisitDuration}</strong>
          </div>
          <div className='column eight wide'>
            Category: <strong>{category}</strong>
          </div>
        </div>
        <div className='row'>
          <div className='column eight wide'>
            Pages per Visit: <strong>{commafy(pagesPerVisit)}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DomainStatsbar

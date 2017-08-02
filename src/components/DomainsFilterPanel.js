import React, { Component } from 'react'

import './DomainsFilterPanel.css'

class DomainsFilterPanel extends Component {
  render () {
    return (
      <div className='DomainsFilterPanel BoxFrame'>
        <div className='ui grid stackable'>
          <div className='SearchContainer column sixteen wide'>
            <div className='ui left icon input'>
              <i className='search icon' />
              <input type='text' placeholder='Search Domain' />
            </div>
          </div>
          <div className='column sixteen wide'>
            <div className='ListTitle'>
            Status
            </div>
            <ul className='ui list'>
              <li className='item'>
                <div className='ui input'>
                  <input
                    type='checkbox'
                    id='DomainsFilterPanel_InRegistry' />
                </div>
                <label htmlFor='DomainsFilterPanel_InRegistry'>In Registry</label>
              </li>
              <li className='item'>
                <div className='ui input'>
                  <input
                    type='checkbox'
                    id='DomainsFilterPanel_InApplication' />
                </div>
                <label htmlFor='DomainsFilterPanel_InApplication'>In Application</label>
              </li>
              <li className='item'>
                <div className='ui input'>
                  <input
                    type='checkbox'
                    id='DomainsFilterPanel_InVoting' />
                </div>
                <label htmlFor='DomainsFilterPanel_InVoting'>In Voting</label>
              </li>
              <li className='item'>
                <div className='ui input'>
                  <input
                    type='checkbox'
                    id='DomainsFilterPanel_Rejected' />
                </div>
                <label htmlFor='DomainsFilterPanel_Rejected'>Rejected</label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default DomainsFilterPanel

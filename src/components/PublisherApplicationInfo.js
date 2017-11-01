import React, { Component } from 'react'

import './PublisherApplicationInfo.css'

import discoverImage from './assets/expand_blue_circle.png'
import cpmImage from './assets/dollar_blue_circle.png'
import identityImage from './assets/cylinder_blue_lock_circle.png'
import campaignsImage from './assets/certificate_blue_circle.png'

class PublisherApplicationInfo extends Component {
  render () {
    return (
      <div className='PublisherApplicationInfo BoxFrame'>
        <div className='ui grid'>
          <div className='column sixteen wide left aligned'>
            <div className='ui large header'>
              adChain Benefits the Publisher
            </div>
          </div>
          <div className='column sixteen wide'>
            <div className='FeatureGrid ui grid stackable'>
              <div className='column eight wide'>
                <div className='ui image'>
                  <img src={campaignsImage} alt='' />
                </div>
                <div className='header'>
                  Attract More Premium Campaigns
                </div>
                <div className='content'>
                  <p>
                    Publishers in the adChain Registry attract more premium campaigns. Drive competition for every impression.
                  </p>

                </div>
              </div>
              <div className='column eight wide'>
                <div className='ui image'>
                  <img src={cpmImage} alt='' />
                </div>
                <div className='header'>
                Higher CPMs
                </div>
                <div className='content'>
                  <p>
                  Advertisers’ increased confidence that their ads are being placed on non-fraudulent sites and being viewed by real human traffic drives higher CPMs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PublisherApplicationInfo

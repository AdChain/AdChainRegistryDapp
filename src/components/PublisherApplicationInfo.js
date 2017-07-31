import React, { Component } from 'react'

import './PublisherApplicationInfo.css'

import transparencyImage from './assets/node_links_blue.png'
import discoverImage from './assets/expand_circle_blue.png'
import cpmImage from './assets/dollar_circle_blue.png'
import identityImage from './assets/cylinder_lock_blue.png'
import impressionsImage from './assets/player_check_circle_blue.png'
import campaignsImage from './assets/certificate_blue.png'

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
                  <img src={transparencyImage} alt='' />
                </div>
                <div className='header'>
                  Full Transparency
                </div>
                <div className='content'>
                  <p>See the entire supply chain - know every provider who sold (or re-sold) your inventory</p>
                </div>
              </div>
              <div className='column eight wide'>
                <div className='ui image'>
                  <img src={discoverImage} alt='' />
                </div>
                <div className='header'>
    Maximize Discoverability
                </div>
                <div className='content'>
                  <p>
                  Drive competition for every impression
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
                  Advertisers’ increased confidence that their ads are being placed on sites free of fraud and being viewed by real human traffic
                  </p>
                </div>
              </div>
              <div className='column eight wide'>
                <div className='ui image'>
                  <img src={identityImage} alt='' />
                </div>
                <div className='header'>
    Impenetrable Identity
                </div>
                <div className='content'>
                  <p>
                  100% confidence knowing your identity cannot be replicated or spoofed. See Nefarious behavior (e.g. Bot traffic)
                  </p>
                </div>
              </div>
              <div className='column eight wide'>
                <div className='ui image'>
                  <img src={impressionsImage} alt='' />
                </div>
                <div className='header'>
    Verified Impressions
                </div>
                <div className='content'>
                  <p>
                  Minimize fraud and give buyers confidence knowing you’re the only seller of mTLS-certified impressions for your website (i.e. true verification)
                  </p>
                </div>
              </div>
              <div className='column eight wide'>
                <div className='ui image'>
                  <img src={campaignsImage} alt='' />
                </div>
                <div className='header'>
    Attract More Premium Campaigns
                </div>
                <div className='content'>
                  <p>
                  adChain verified publishers attract more premium campaigns due to the increased auditability that advertisers have on [adChain] campaign data
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

import PubSub from 'pubsub-js'
import { renderAirSwap } from '../utils/renderAirSwap'
import governanceIcon from '../components/assets/governance_icon.svg'
import applyIcon from '../components/assets/apply_icon.svg'
import domainsIcon from '../components/assets/domains_icon.svg'
import adtokenIcon from '../components/assets/adtoken_icon.svg'

export const mobileNavData = [
  {
    name: 'DOMAINS',
    img: domainsIcon,
    alt: 'www',
    link: '/domains',
    type: 'Link'
  },
  {
    name: 'APPLY',
    img: applyIcon,
    alt: 'apply',
    action: () => {
      PubSub.publish('MobileApplication.show')
      PubSub.publish('DomainsFilterPanel.toggle')
      setTimeout(() => {
        window.scrollTo(0, -1)
      }, 200)
    },
    type: 'div'
  },
  {
    name: 'ADTOKEN',
    img: adtokenIcon,
    alt: 'adtoken',
    link: '/domains',
    action: () => { renderAirSwap() },
    type: 'div'
  },
  {
    name: 'GOVERNANCE',
    img: governanceIcon,
    alt: 'governance',
    link: '/governance',
    type: 'Link'
  }
]

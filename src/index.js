import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import App from './App'
import registry from './services/registry'
import plcr from './services/plcr'
import DocumentLoadingComponent from './components/DocumentLoadingComponent'
import parameterizer from './services/parameterizer'
import token from './services/token'
import store from 'store'
import isMobile from 'is-mobile'
import { getPermissions } from './services/provider'

import './index.css'
require('dotenv').config()

async function init() {

  let hasAcceptedMobile
  try {
    hasAcceptedMobile = store.get('hasAcceptedMobile')
  } catch (error) {
    console.log(error)
  }
  if (isMobile() && !hasAcceptedMobile && !window.web3) {
    ReactDOM.render(<DocumentLoadingComponent />, document.getElementById('root'))
    return
  }

  try {
    await Promise.all([
      getPermissions(),
      registry.init(),
      plcr.init(),
      parameterizer.init(),
      token.init()
    ])

  } catch (error) {
    console.error(error)
  }
  ReactDOM.render(<App />, document.getElementById('root'))
  registerServiceWorker()
  // unregister()
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.web3) {
    init()
  } else {
    // wait for metamask web3 to be injected
    setTimeout(() => {
      init()
    }, 1e3)
  }
}, false
)

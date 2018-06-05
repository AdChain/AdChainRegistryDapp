import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import App from './App'
import registry from './services/registry'
import plcr from './services/plcr'
import parameterizer from './services/parameterizer'
import token from './services/token'

import './index.css'
require('dotenv').config()
 
async function init() {

  try {
    await Promise.all([
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

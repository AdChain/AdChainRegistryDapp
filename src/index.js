import React from 'react'
import ReactDOM from 'react-dom'

import registerServiceWorker from './registerServiceWorker'
import App from './App'
import AdBlockAlert from './AdBlockAlert'

import registry from './services/registry'
import plcr from './services/plcr'
import parameterizer from './services/parameterizer'
import token from './services/token'
import DocumentLoadingComponent from './components/DocumentLoadingComponent.js'
import isMobile  from 'is-mobile'
import store from "store"

import './index.css'


function adBlockDetected () {
  ReactDOM.render(<AdBlockAlert />, document.getElementById('root'))
}

async function init () {
  let hasAcceptedMobile

  try{
    hasAcceptedMobile = store.get('hasAcceptedMobile')
  }
  catch(error){
    console.log(error)
  }

  if (isMobile() && !hasAcceptedMobile) {
       ReactDOM.render(<DocumentLoadingComponent />, document.getElementById("root"))
       return
  }

  if (typeof window.fuckAdBlock === 'undefined') {
    adBlockDetected()
    return false
  } else {
    window.fuckAdBlock.onDetected(adBlockDetected)
  }

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


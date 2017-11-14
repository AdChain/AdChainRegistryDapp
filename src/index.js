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

import './index.css'

/*
  Application Initialization Steps:
    - Determine if user is on device smaller than 767px
    - Load appropriate loading screen
    - Initialize the core functions and wait
    - Render the main app components
*/
export let determineScreenLoader = (show) => {

  if(window.innerWidth < 767 && !show){
      ReactDOM.render(<DocumentLoadingComponent/>, document.getElementById("root"))
      return;
  }
  else init();
  

  function adBlockDetected () {
      ReactDOM.render(<AdBlockAlert />, document.getElementById('root'))
  }

  async function init () {

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
  }, false)

}
determineScreenLoader();

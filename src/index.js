import React from 'react'
import ReactDOM from 'react-dom'

import registerServiceWorker from './registerServiceWorker'
import App from './App'
import AdBlockAlert from './components/adblock/AdBlockAlert'

import registry from './services/registry'
import plcr from './services/plcr'
import parameterizer from './services/parameterizer'
import token from './services/token'
import DocumentLoadingComponent from './components/DocumentLoadingComponent.js'
import isMobile from 'is-mobile'
import store from 'store'
import calculateGas from "./utils/calculateGas"

import './index.css'
require('dotenv').config()

const adblockDetect = require('adblock-detect')

function adBlockDetected () {
  ReactDOM.render(<AdBlockAlert />, document.getElementById('root'))
  return
}

async function init () {
  let hasAcceptedMobile
  try {
    hasAcceptedMobile = store.get('hasAcceptedMobile')
  } catch (error) {
    console.log(error)
  }

  if (isMobile() && !hasAcceptedMobile) {
    ReactDOM.render(<DocumentLoadingComponent />, document.getElementById('root'))
    return
  }

  if (typeof window.fuckAdBlock === 'undefined') {
    adBlockDetected()
    return false
  } else {
    adblockDetect(async function(adblock) {
      if (adblock) {
        adBlockDetected()
        console.log('Ad blocker is detected')      
      } else {
        // console.log('Ad blocker is not detected');
        try {
          await Promise.all([
            registry.init(),
            plcr.init(),
            parameterizer.init(),
            token.init()
          ])
          try {
            // Store item to prevent multiple entries of page load event
            let time = Number(window.localStorage.getItem('page load'))
            if(time){
              if(time > Date.now() + 40000){
                calculateGas({
                  event: 'page load',
                  contract_event: false
                })
                window.localStorage.setItem('page load', Date.now())
              }
            }else{
              window.localStorage.setItem('page load', Date.now())
              calculateGas({
                event: 'page load',
                contract_event: false
              })
            }
          } catch (error) {
            console.log('error reporting gas')
          }
        } catch (error) {
          console.error(error)
        }
        ReactDOM.render(<App />, document.getElementById('root'))
        registerServiceWorker()
      }},
    {
      testInterval: 40,
      testRuns: 5
    })    
  }
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

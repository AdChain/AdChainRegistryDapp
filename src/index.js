import React from 'react'
import ReactDOM from 'react-dom'

import registerServiceWorker from './registerServiceWorker'
import App from './App'
import AdBlockAlert from './AdBlockAlert'
import Web3RequiredAlert from './Web3RequiredAlert'

import './index.css'

function adBlockDetected () {
  ReactDOM.render(<AdBlockAlert />, document.getElementById('root'))
}

function noWeb3Detected () {
  ReactDOM.render(<Web3RequiredAlert />, document.getElementById('root'))
}

function init () {
  if (typeof window.fuckAdBlock === 'undefined') {
    adBlockDetected()
    return false
  } else {
    window.fuckAdBlock.onDetected(adBlockDetected)
  }

  if (!window.web3) {
    noWeb3Detected()
    return false
  }

  ReactDOM.render(<App />, document.getElementById('root'))
  registerServiceWorker()
}

init()

import React from 'react'
import ReactDOM from 'react-dom'

import registerServiceWorker from './registerServiceWorker'
import App from './App'
import AdBlockAlert from './AdBlockAlert'

import './index.css'

function adBlockDetected () {
  ReactDOM.render(<AdBlockAlert />, document.getElementById('root'))
}

function init () {
  if (typeof window.fuckAdBlock === 'undefined') {
    adBlockDetected()
    return false
  } else {
    window.fuckAdBlock.onDetected(adBlockDetected)
  }

  ReactDOM.render(<App />, document.getElementById('root'))
  registerServiceWorker()
}

init()

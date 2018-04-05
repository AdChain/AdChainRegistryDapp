import axios from 'axios'

import { utiltyApiURL } from '../models/urls'

// import registry from "../services/registry"
// import parameterizer from "../services/parameterizer"

let data = {
  'action': 'click',
  'address': '0x7823kld392kj39fjag4bnbcab1',
  'adt_balance': 0,
  'contract': 'reg',
  'contract_event': true,
  'parameter': 'none',
  'proposal_value': 0,
  'domain': 'i.com',
  'eth_balance': 0,
  'event_success': false,
  'page_event': false,
  'timestamp': Date.now(),
  'timezone': 'PST',
  'value_staked': 0,
  'eth_price': 0,
  'adt_price': 0,
  'network': 'rinkeby'
}

const calculateGas = async () => {
  try {
    await axios.post(`${utiltyApiURL}/calculate/gas`, data)
  } catch (error) {
    console.log('err: ', error)
  }
}

export default calculateGas

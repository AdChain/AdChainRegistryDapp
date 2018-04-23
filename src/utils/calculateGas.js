import axios from 'axios'

import { utilityApiURL } from '../models/urls'

import token from '../services/token'
import moment from 'moment'
import registry from '../services/registry'
import priceStats from '../services/priceStats'

const calculateGas = async (x) => {
  const web3 = window.web3
  const account = registry.getAccount()

  if (web3 && account) {
    var network = await registry.getNetwork()
    var adtBalance = await token.getBalance()
    var ethBalance = await registry.getEthBalance()
    var minDeposit = await registry.getMinDeposit()
  }

  const {ethUsd, adtUsd} = await priceStats()

  let data = {
    'action': x.action || 'null',
    'address': account || 'null',
    'web3': !!web3,
    'adt_balance': (adtBalance | 0) || 0,
    'contract': x.contract || 'null',
    'contract_event': x.contract_event,
    'parameter': x.parameter || 'null',
    'proposal_value': x.proposal_value || 0,
    'min_deposit': minDeposit || 0,
    'domain': x.domain || 'null',
    'eth_balance': ethBalance || 0,
    'event_success': x.event_success,
    'timestamp': Date.now(),
    'event': x.event || 'null',
    'timezone': moment.tz(moment.tz.guess()).zoneAbbr(),
    'value_staked': x.value_staked || 0,
    'eth_price': ethUsd || 0,
    'adt_price': adtUsd || 0,
    'network': network ? network.type : 'null'
  }

  try {
    let res = await axios.post(`${utilityApiURL}/calculate/gas`, data)
    return res
  } catch (error) {
    console.log('catch: calculating gas')
  }
}

export default calculateGas

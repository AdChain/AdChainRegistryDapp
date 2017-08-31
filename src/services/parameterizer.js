import pify from 'pify'

import { getAddress, getAbi } from '../config'

const address = getAddress('parameterizer')
const abi = getAbi('parameterizer')

class ParameterizerService {
  constructor () {
    this.parameterizer = null
    this.address = address

    this.initContract()
  }

  initContract () {
    if (window.web3) {
      if (!this.parameterizer) {
        this.parameterizer = window.web3.eth.contract(abi).at(this.address)
      }
    }
  }

  async get (name) {
    return new Promise(async (resolve, reject) => {
      if (!name) {
        reject(new Error('Name is required'))
        return false
      }

      if (!this.registry) {
        this.initContract()
      }

      let result = await pify(this.parameterizer.get)(name)

      if (typeof result === 'object' && result.isBigNumber) {
        result = result.toNumber()
      }

      resolve(result)
    })
  }
}

export default new ParameterizerService()

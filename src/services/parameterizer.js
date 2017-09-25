import tc from 'truffle-contract' // truffle-contract

import store from '../store'
import { getProvider } from './provider'
import { getAddress } from '../config'
import Parameterizer from '../config/parameterizer.json'

const address = getAddress('parameterizer')

class ParameterizerService {
  constructor () {
    this.parameterizer = null
    this.address = address

    this.initContract()
  }

  async initContract () {
    if (this.parameterizer) {
      return false
    }

    if (this.pendingDeployed) {
      await this.pendingDeployed
      this.pendingDeploy = null
      return false
    }

    const contract = tc(Parameterizer)
    contract.setProvider(getProvider())
    this.pendingDeployed = contract.deployed()
    const deployed = await this.pendingDeployed
    this.parameterizer = deployed
    this.pendingDeploy = null
  }

  setUpEvents () {
    this.parameterizer.allEvents()
      .watch((error, log) => {
        if (error) {
          console.error(error)
          return false
        }

        store.dispatch({
          type: 'PARAMETERIZER_EVENT'
        })
      })
  }

  async get (name) {
    return new Promise(async (resolve, reject) => {
      if (!name) {
        reject(new Error('Name is required'))
        return false
      }

      await this.initContract()

      let result = await this.parameterizer.get(name)

      if (typeof result === 'object' && result.isBigNumber) {
        result = result.toNumber()
      }

      resolve(result)
    })
  }
}

export default new ParameterizerService()

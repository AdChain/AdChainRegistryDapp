import { getParameterizer } from '../config'
import store from '../store'

class ParameterizerService {
  constructor () {
    this.parameterizer = null
    this.address = null

    this.initContract()
  }

  async initContract () {
    this.parameterizer = await getParameterizer(window.web3.eth.defaultAccount)
    this.address = this.parameterizer.address

    store.dispatch({
      type: 'PARAMETERIZER_CONTRACT_INIT'
    })
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

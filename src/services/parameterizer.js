import Eth from 'ethjs'
import { getProvider } from './provider'
import { getParameterizer } from '../config'
import store from '../store'
import sha3 from 'solidity-sha3'

class ParameterizerService {
  constructor () {
    this.parameterizer = null
    this.address = null
    this.account = null
  }

  async init () {
    /*
     * important to check for provider in
     * init function (rather than constructor),
     * so that injected web3 has time to load.
     */
    try {
      this.eth = new Eth(getProvider())
      const accounts = await this.eth.accounts()
      this.account = accounts[0]
      console.log(this.account)
      this.eth.defaultAccount = '0x25cB5FA4d555d5Ef8EEB13A2f5167de7BeC7035F'
      this.parameterizer = await getParameterizer(this.account)
      this.address = this.parameterizer.address
    } catch (error) {
      console.log(error)
    }
    // await this.setUpEvents()
    // store.dispatch({
    //   type: 'PARAMETERIZER_CONTRACT_INIT'
    // })
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
    let result
    if (!this.parameterizer) return

    return new Promise(async (resolve, reject) => {
      if (!name) {
        reject(new Error('Name is required'))
        return false
      }
      try {
        result = await this.parameterizer.get.call(
          name)
        if (typeof result === 'object' && result.isBigNumber) {
          result = result.toNumber()
        }
        resolve(result)
      } catch (error) {
        console.log(error)
      }
    })
  }

  async getProposals (name, value) {
    let result
    try {
      const hash = sha3(name, value)
      result = await this.parameterizer.proposals.call(hash)
    } catch (error) {
      console.log(error)
    }
    return result
  }

  async proposeReparameterization (name, value) {
    let result
    if (!name || !value) { console.log('name or value missing'); return }
    try {
      result = await this.parameterizer.proposeReparameterization('voteQuorum', '52')
    } catch (error) {
      console.log(error)
    }
    return result
  }
}

export default new ParameterizerService()

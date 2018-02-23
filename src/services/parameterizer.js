import Eth from 'ethjs'
import { getProvider } from './provider'
import { getParameterizer } from '../config'
import store from '../store'
import sha3 from 'solidity-sha3'
import token from './token'

const big = (number) => new Eth.BN(number.toString(10))
const tenToTheNinth = big(10).pow(big(9))

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
      this.eth.defaultAccount = this.account
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

  async setUpEvents () {
    let events = await this.parameterizer.contract.allEvents({fromBlock: 0, toBlock: 'latest'})
    events.get((error, log) => {
      if (error) {
        console.error(error)
        return false
      } else {
        console.log('log: ', log)
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
        result = await this.parameterizer.get.call(name)
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
      const hash = sha3('voteQuorum', 51)
      result = await this.parameterizer.proposals.call(hash)
    } catch (error) {
      console.log(error)
    }
    return result
  }

  async proposeReparameterization (deposit, name, value) {
    let result
    if (!name || !value) { console.log('name or value missing'); return }
    try {
      const bigDeposit = big(deposit).mul(tenToTheNinth).toString(10)
      const allowed = await token.allowance(this.account, this.address).toString('10')

      if (allowed >= bigDeposit) {
        try {
          await token.approve(this.address, bigDeposit)
        } catch (error) {
          throw error
        }
      }
      result = await this.parameterizer.proposeReparameterization(name, value)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
    return result
  }
}

export default new ParameterizerService()

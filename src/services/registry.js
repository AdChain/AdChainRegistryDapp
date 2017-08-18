import sha3 from 'solidity-sha3'
import pify from 'pify'

import token from './token'
import parameterizer from './parameterizer'
const {registry:address} = require('../config/address.json')

const abi = require('../config/registry.json').abi

class RegistryService {
  constructor () {
    this.registry = null
    this.address = address

    this.initContract()
  }

  initContract () {
    if (!window.web3) {
      return false
    }

    if (!this.registry) {
      this.registry = window.web3.eth.contract(abi).at(this.address)
    }
  }

  async apply (domain) {
    return new Promise(async (resolve, reject) => {
      if (!domain) {
        reject(new Error('Domain is required'))
        return false
      }

      if (!this.registry) {
        this.initContract()
      }

      const minDeposit = 100

      const exists = await this.applicationExists(domain)

      if (exists) {
        reject(new Error('Application already exists'))
        return false
      }

      const approveTx = await token.approve(this.address, minDeposit)
      await this.getTransactionReceipt(approveTx)

      const result = await pify(this.registry.apply)(domain)

      resolve(result)
    })
  }

  async challenge (domain) {
    return new Promise(async (resolve, reject) => {
      if (!domain) {
        reject(new Error('Domain is required'))
        return false
      }

      if (!this.registry) {
        this.initContract()
      }

      const minDeposit = 100

      const approveTx = await token.approve(this.address, minDeposit)
      await this.getTransactionReceipt(approveTx)

      const tx = await pify(this.registry.challenge)(domain)

      const receipt = await this.getTransactionReceipt(tx)
      const challengeId = parseInt(receipt.logs[1].data, 16)

      resolve(challengeId)
    })
  }

  async applicationExists (domain) {
    return new Promise(async (resolve, reject) => {
      if (!domain) {
        reject(new Error('Domain is required'))
        return false
      }

      if (!this.registry) {
        this.initContract()
      }

      const exists = await pify(this.registry.appExists.call)(domain)

      resolve(exists)
    })
  }

  async getListing(domain) {
    return new Promise(async (resolve, reject) => {
      if (!domain) {
        reject(new Error('Domain is required'))
        return false
      }

      if (!this.registry) {
        this.initContract()
      }

      const hash = sha3(domain)

      const result = await pify(this.registry.listingMap.call)(hash)

      const map = {
        applicationExpiry: result[0].toNumber(),
        isWhitelisted: result[1],
        ownerAddress: result[2],
        currentDeposit: result[3].toNumber(),
        challengeID: result[4].toNumber()
      }

      resolve(map)
    })
  }

  async getChallenge(challengeId) {
    return new Promise(async (resolve, reject) => {
      if (!challengeId) {
        reject(new Error('Challenge ID is required'))
        return false
      }

      if (!this.registry) {
        this.initContract()
      }

      const result = await pify(this.registry.challengeMap.call)(challengeId)

      const map = {
        // (remaining) pool of tokens distributed amongst winning voters
        rewardPool: result[0].toNumber(),
        // owner of challenge
        challenger: result[1],
        // indication of if challenge is resolved
        resolved: result[2],
        // number of tokens at risk for either party during challenge
        stake: result[3].toNumber(),
        // (remaining) amount of tokens used for voting by the winning side
        totalTokens: result[4]
      }

      resolve(map)
    })
  }

  async isWhitelisted (domain) {
    return new Promise(async (resolve, reject) => {
      if (!domain) {
        reject(new Error('Domain is required'))
        return false
      }

      if (!this.registry) {
        this.initContract()
      }

      const whitelisted = await pify(this.registry.isWhitelisted.call)(domain)

      resolve(whitelisted)
    })
  }

  async getParameter (name) {
    return new Promise(async (resolve, reject) => {
      if (!name) {
        reject(new Error('Parameter name is required'))
        return false
      }

      if (!this.registry) {
        this.initContract()
      }

      const value = await parameterizer.get(name)

      resolve(value)
    })
  }

  async getTransactionReceipt (tx) {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        this.initContract()
      }

      const result = await pify(window.web3.eth.getTransactionReceipt)(tx)

      resolve(result)
    })
  }
}

export default new RegistryService()

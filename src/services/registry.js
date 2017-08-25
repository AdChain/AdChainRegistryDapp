import sha3 from 'solidity-sha3'
import pify from 'pify'
import keyMirror from 'key-mirror'

import store from '../store'
import token from './token'
import plcr from './plcr'
import parameterizer from './parameterizer'
import saltHashVote from '../utils/saltHashVote'
const {registry:address} = require('../config/address.json')
const abi = require('../config/registry.json').abi

const parameters = keyMirror({
  minDeposit: null,
  applyStageLen: null,
  voteQuorum: null,
  commitPeriodLen: null,
  revealPeriodLen: null
})

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

  async apply (domain, deposit=0) {
    return new Promise(async (resolve, reject) => {
      if (!domain) {
        reject(new Error('Domain is required'))
        return false
      }

      if (!this.registry) {
        this.initContract()
      }

      const exists = await this.applicationExists(domain)

      if (exists) {
        reject(new Error('Application already exists'))
        return false
      }

      const approveTx = await token.approve(this.address, deposit)
      await this.getTransactionReceipt(approveTx)

      const result = await pify(this.registry.apply)(domain)

      store.dispatch({
        type: 'REGISTRY_DOMAIN_APPLY',
        domain
      })

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

      const exists = await pify(this.registry.appExists)(domain)

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

      const result = await pify(this.registry.listingMap)(hash)

      const map = {
        applicationExpiry: result[0].toNumber(),
        isWhitelisted: result[1],
        ownerAddress: result[2],
        currentDeposit: result[3].toNumber(),
        challengeId: result[4].toNumber()
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

      const challenge = await pify(this.registry.challengeMap)(challengeId)

      const map = {
        // (remaining) pool of tokens distributed amongst winning voters
        rewardPool: challenge[0].toNumber(),
        // owner of challenge
        challenger: challenge[1],
        // indication of if challenge is resolved
        resolved: challenge[2],
        // number of tokens at risk for either party during challenge
        stake: challenge[3].toNumber(),
        // (remaining) amount of tokens used for voting by the winning side
        totalTokens: challenge[4]
      }

      resolve(map)
    })
  }

  async getChallengeId (domain) {
    if (!domain) {
      return new Error('Domain is required')
    }

    const listing = await this.getListing(domain)

    const {
      challengeId
    } = listing

    return challengeId
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

      const whitelisted = await pify(this.registry.isWhitelisted)(domain)

      resolve(whitelisted)
    })
  }

  async updateStatus (domain) {
    return new Promise(async (resolve, reject) => {
      if (!domain) {
        reject(new Error('Domain is required'))
        return false
      }

      if (!this.registry) {
        this.initContract()
      }

      const result = await pify(this.registry.updateStatus)(domain)

      resolve(result)
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

  getParameterKeys () {
    return Promise.resolve(parameters)
  }

  getMinDeposit () {
    return this.getParameter('minDeposit')
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

  async getCurrentBlockNumber () {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        this.initContract()
      }

      const result = await pify(window.web3.eth.getBlockNumber)()

      resolve(result)
    })
  }

  async getCurrentBlockTimestamp () {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        this.initContract()
      }

      const result = await pify(window.web3.eth.getBlock)('latest')

      resolve(result.timestamp)
    })
  }

  async getPlcrAddress () {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        this.initContract()
      }

      const result = await pify(this.registry.voting)()

      resolve(result)
    })
  }

  async commitPeriodActive (domain) {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        this.initContract()
      }

      const pollId = await this.getChallengeId(domain)

      if (!pollId) {
        resolve(false)
        return false
      }

      const result = await plcr.commitPeriodActive(pollId)

      resolve(result)
    })
  }

  async revealPeriodActive (domain) {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        this.initContract()
      }

      if (!domain) {
        reject(new Error('Domain is required'))
        return false
      }

      const pollId = await this.getChallengeId(domain)

      if (!pollId) {
        resolve(false)
        return false
      }

      const result = await plcr.revealPeriodActive(pollId)

      resolve(result)
    })
  }

  async commitVote ({domain, votes, voteOption, salt}) {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        this.initContract()
      }

      if (!domain) {
        reject(new Error('Domain is required'))
        return false
      }

      const challengeId = await this.getChallengeId(domain)
      const prevPollId = 0
      const hash = saltHashVote(voteOption, salt)

      const result = plcr.commit({pollId: challengeId, hash, tokens: votes, prevPollId})

      resolve(result)
    })
  }

  async revealVote ({domain, voteOption, salt}) {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        this.initContract()
      }

      const challengeId = await this.getChallengeId(domain)

      const result = plcr.reveal({pollId: challengeId, voteOption, salt})

      resolve(result)
    })
  }

  getChallengePoll (domain) {
    return new Promise(async (resolve, reject) => {
      const challengeId = await this.getChallengeId(domain)
      const result = plcr.getPoll(challengeId)
      resolve(result)
    })
  }

  pollEnded (domain) {
    return new Promise(async (resolve, reject) => {
      const challengeId = await this.getChallengeId(domain)

      if (!challengeId) {
        resolve(false)
        return false
      }

      const result = plcr.pollEnded(challengeId)
      resolve(result)
    })
  }
}

export default new RegistryService()

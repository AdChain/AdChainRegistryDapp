import sha3 from 'solidity-sha3'
import pify from 'pify'

import token from './token'
import store from '../store'
const abi = require('../config/plcr.json').abi

/**
 * PollId = ChallengeId
 */

class PlcrService {
  constructor () {
    this.plcr = null
    this.address = null

    this.initContract()
  }

  async initContract () {
    if (!window.web3) {
      return false
    }

    const registry = require('./registry').default

    if (!this.plcr && registry && registry.getPlcrAddress) {
      const address = await registry.getPlcrAddress()
      const plcr = await window.web3.eth.contract(abi).at(address)

      this.address = address
      this.plcr = plcr
    }
  }

  async commit ({pollId, hash, tokens, prevPollId}) {
    return new Promise(async (resolve, reject) => {
      if (!pollId) {
        reject(new Error('PollId is required'))
        return false
      }

      if (!hash) {
        reject(new Error('Hash is required'))
        return false
      }

      if (!tokens) {
        reject(new Error('Tokens are required'))
        return false
      }

      if (!this.plcr) {
        await this.initContract()
      }

      const active = await pify(this.plcr.commitPeriodActive.call)(pollId);

      if (!active) {
        reject(new Error('Commit stage should be active'))
        return false
      }

      const approveTx = await pify(this.plcr.requestVotingRights)(tokens)
      await this.getTransactionReceipt(approveTx)

      const result = await pify(this.plcr.commitVote)(pollId, hash, tokens, prevPollId)

      store.dispatch({
        type: 'PLCR_VOTE_COMMIT',
        pollId
      })

      resolve(result)
    })
  }

  async getTokensCommited (pollId) {
    return new Promise(async (resolve, reject) => {
      const numTokens = await this.plcr.getNumTokens(pollId);

      resolve(numTokens)
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

export default new PlcrService()

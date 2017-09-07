import pify from 'pify'

import token from './token'
import store from '../store'
import { getAbi } from '../config'

const abi = getAbi('plcr')

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

      this.forceMine = registry.forceMine.bind(registry)
      this.setUpEvents()
    }
  }

  setUpEvents () {
    this.plcr.allEvents()
      .watch((error, log) => {
        if (error) {
          console.error(error)
          return false
        }

        store.dispatch({
          type: 'PLCR_EVENT'
        })
      })
  }

  async getPoll (pollId) {
    return new Promise(async (resolve, reject) => {
      if (!pollId) {
        reject(new Error('Poll ID is required'))
        return false
      }

      if (!this.plcr) {
        await this.initContract()
      }

      try {
        const result = await pify(this.plcr.pollMap)(pollId)

        const map = {
          // proposal to be voted for/against
          proposal: result[0],
          // expiration date of commit period for poll
          commitEndDate: result[1].toNumber(),
          // expiration date of reveal period for poll
          revealEndDate: result[2].toNumber(),
          // number of votes required for a proposal to pass
          voteQuorum: result[3].toNumber(),
          // tally of votes supporting proposal
          votesFor: result[4].toNumber(),
          // tally of votes countering proposal
          votesAgainst: result[5].toNumber()
        }

        resolve(map)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async commitPeriodActive (pollId) {
    return new Promise(async (resolve, reject) => {
      if (!pollId) {
        reject(new Error('Poll ID is required'))
        return false
      }

      if (!this.plcr) {
        await this.initContract()
      }

      try {
        const result = await pify(this.plcr.commitPeriodActive)(pollId);
        resolve(result)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async revealPeriodActive (pollId) {
    return new Promise(async (resolve, reject) => {
      if (!pollId) {
        reject(new Error('Poll ID is required'))
        return false
      }

      if (!this.plcr) {
        await this.initContract()
      }

      try {
        const result = await pify(this.plcr.revealPeriodActive)(pollId)
        resolve(result)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async commit ({pollId, hash, tokens, prevPollId}) {
    return new Promise(async (resolve, reject) => {
      if (!pollId) {
        reject(new Error('Poll ID is required'))
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

      let active = null

      try {
        active = await this.commitPeriodActive(pollId)
      } catch (error) {
        reject(error)
        return false
      }

      if (!active) {
        reject(new Error('Commit stage should be active'))
        return false
      }

      try {
        await token.approve(this.address, tokens)
        await this.forceMine()
      } catch (error) {
        reject(error)
        return false
      }

      try {
        await pify(this.plcr.requestVotingRights)(tokens)
        await this.forceMine()
      } catch (error) {
        reject(error)
        return false
      }

      try {
        const result = await pify(this.plcr.commitVote)(pollId, hash, tokens, prevPollId)
        await this.forceMine()

        store.dispatch({
          type: 'PLCR_VOTE_COMMIT',
          pollId
        })

        resolve(result)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async reveal ({pollId, voteOption, salt}) {
    return new Promise(async (resolve, reject) => {
      try {
        await pify(this.plcr.revealVote)(pollId, salt, voteOption)
        await this.forceMine()

        store.dispatch({
          type: 'PLCR_VOTE_REVEAL',
          pollId
        })

        resolve()
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async getTokensCommited (pollId) {
    return new Promise(async (resolve, reject) => {
      try {
        const numTokens = await pify(this.plcr.getNumTokens)(pollId)
        resolve(numTokens)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  hasEnoughTokens (tokens) {
    return new Promise(async (resolve, reject) => {
      if (!this.plcr) {
        await this.initContract()
      }

      if (!tokens) {
        reject(new Error('Tokens is required'))
        return false
      }

      try {
        const result = await pify(this.plcr.hasEnoughTokens)(tokens)
        resolve(result)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async pollEnded (pollId) {
    return new Promise(async (resolve, reject) => {
      if (!this.plcr) {
        await this.initContract()
      }

      try {
        const result = await pify(this.plcr.pollEnded)(pollId)
        resolve(result)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async getCommitHash (pollId) {
    return new Promise(async (resolve, reject) => {
      if (!this.plcr) {
        await this.initContract()
      }

      try {
        const hash = await pify(this.plcr.getCommitHash)(pollId)

        resolve(hash)
      } catch (error) {
        reject(error)
      }
    })
  }

  async hasBeenRevealed (pollId) {
    return new Promise(async (resolve, reject) => {
      if (!this.plcr) {
        await this.initContract()
      }

      try {
        const didReveal = await pify(this.plcr.hasBeenRevealed)(pollId)

        resolve(didReveal)
      } catch (error) {
        reject(error)
      }
    })
  }

  async getTransactionReceipt (tx) {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        this.initContract()
      }

      try {
        const result = await pify(window.web3.eth.getTransactionReceipt)(tx)
        resolve(result)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }
}

export default new PlcrService()

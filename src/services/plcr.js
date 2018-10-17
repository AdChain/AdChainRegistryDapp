import Eth from 'ethjs'
import { getProvider } from './provider'
// import { promisify as pify } from 'bluebird'

import { getPLCR } from '../config'
import token from './token'
import store from '../store'
import PubSub from 'pubsub-js'
import { getTxReceiptMined } from '../utils/getTxReceiptMined'

/*
 * PollId = ChallengeId
 */

class PlcrService {
  constructor () {
    this.plcr = null
    this.address = null
  }

  async init () {
    /* important to check for provider in
     * init function (rather than constructor),
     * so that injected web3 has time to load.
     */
    this.eth = new Eth(getProvider())
    const accounts = await this.eth.accounts()
    this.account = accounts[0]
    this.plcr = await getPLCR(this.account)
    this.address = this.plcr.address
    // this.setUpEvents()

    store.dispatch({
      type: 'PLCR_CONTRACT_INIT'
    })
  }

  // setUpEvents () {
  //   this.plcr.allEvents()
  //     .watch((error, log) => {
  //       if (error) {
  //         console.error(error)
  //         return false
  //       }

  //       store.dispatch({
  //         type: 'PLCR_EVENT'
  //       })
  //     })
  // }

  async getPoll (pollId) {
    return new Promise(async (resolve, reject) => {
      if (!pollId) {
        reject(new Error('Poll ID is required'))
        return false
      }

      try {
        const result = await this.plcr.pollMap(pollId)

        const map = {
          // expiration date of commit stage for poll
          commitEndDate: result[0] ? result[0].toNumber() : null,
          // expiration date of reveal stage for poll
          revealEndDate: result[1] ? result[1].toNumber() : null,
          // number of votes required for a proposal to pass
          voteQuorum: result[2] ? result[2].toNumber() : 0,
          // tally of votes supporting proposal
          votesFor: result[3] ? result[3].toNumber() : 0,
          // tally of votes countering proposal
          votesAgainst: result[4] ? result[4].toNumber() : 0
        }

        if (map.votesFor) {
          // nano ADT to normal ADT
          map.votesFor = map.votesFor / Math.pow(10, token.decimals)

          // clamp
          if (!map.votesFor || map.votesFor < 0) {
            map.votesFor = 0
          }
        }

        if (map.votesAgainst) {
          map.votesAgainst = map.votesAgainst / Math.pow(10, token.decimals)

          if (!map.votesagainst || map.votesagainst < 0) {
            map.votesagainst = 0
          }
        }

        resolve(map)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async commitStageActive (pollId) {
    return new Promise(async (resolve, reject) => {
      if (!pollId) {
        reject(new Error('Poll ID is required'))
        return false
      }

      try {
        const result = await this.plcr.commitPeriodActive(pollId)
        resolve(result)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async revealStageActive (pollId) {
    return new Promise(async (resolve, reject) => {
      if (!pollId) {
        reject(new Error('Poll ID is required'))
        return false
      }

      try {
        const result = await this.plcr.revealPeriodActive(pollId)
        resolve(result)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async commit ({ pollId, hash, tokens }, transactionSrc) {
    // added transactionSrc param to differentiate between governance and domain voting
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

      let active = null

      try {
        active = await this.commitStageActive(pollId)
      } catch (error) {
        console.error(error)
        reject(error)
        return false
      }

      if (!active) {
        reject(new Error('Commit stage should be active'))
        return false
      }

      const voteTokenBalance = (await this.plcr.voteTokenBalance(this.getAccount())).toString(10)
      const requiredVotes = (tokens - voteTokenBalance)

      let transactionInfo = {
        src: 'not_approved_' + transactionSrc.src,
        title: transactionSrc.title
      }

      let allowed = await (await token.allowance(this.account, this.address)).toString(10)
      // console.log((Number(allowed) <= Number(tokens)), Number(allowed) , Number(tokens), requiredVotes)
      // (Number(allowed) <= Number(tokens))

      // if true this hits first 2 txs
      if (requiredVotes > 0 && (Number(allowed) < Number(tokens))) {
        // Step 1
        try {
          PubSub.publish('TransactionProgressModal.open', transactionInfo)
          await token.approve(this.address, requiredVotes)

          PubSub.publish('TransactionProgressModal.next', transactionInfo)
        } catch (error) {
          PubSub.publish('TransactionProgressModal.error')
          reject(error)
          return false
        }

        // Step 2
        try {
          const tx = await this.plcr.requestVotingRights.sendTransaction(requiredVotes)
          window.localStorage.setItem('txHash', tx)
          await getTxReceiptMined(window.web3, tx)

          PubSub.publish('TransactionProgressModal.next', transactionInfo)
        } catch (error) {
          PubSub.publish('TransactionProgressModal.error')
          reject(error)
          return false
        }
      } else if (requiredVotes > 0) {
        // Step 2: You have already approved token but not requested plcr voting rights
        try {
          PubSub.publish('TransactionProgressModal.open', transactionInfo)
          PubSub.publish('TransactionProgressModal.next', transactionInfo)

          const tx = await this.plcr.requestVotingRights.sendTransaction(requiredVotes)
          window.localStorage.setItem('txHash', tx)
          await getTxReceiptMined(window.web3, tx)

          PubSub.publish('TransactionProgressModal.next', transactionInfo)
        } catch (error) {
          PubSub.publish('TransactionProgressModal.error')
          reject(error)
          return false
        }
      } else {
        // this means that you can use existing voting rights
        transactionInfo = {
          src: 'approved_' + transactionSrc.src,
          title: transactionSrc.title
        }
        PubSub.publish('TransactionProgressModal.open', transactionInfo)
      }

      try {
        // Step 3
        const prevPollId = await this.plcr.getInsertPointForNumTokens.call(this.getAccount(), tokens, pollId)
        const result = await this.plcr.commitVote.sendTransaction(pollId, hash, tokens, prevPollId)
        window.localStorage.setItem('txHash', result)
        await getTxReceiptMined(window.web3, result)

        PubSub.publish('TransactionProgressModal.next', transactionInfo)

        store.dispatch({
          type: 'PLCR_VOTE_COMMIT',
          pollId
        })

        resolve(result)
        return false
      } catch (error) {
        PubSub.publish('TransactionProgressModal.error')
        reject(error)
        return false
      }
    })
  }

  async reveal ({ pollId, voteOption, salt }, transactionSrc) {
    return new Promise(async (resolve, reject) => {
      try {
        let transactionInfo = {
          src: transactionSrc.src,
          title: transactionSrc.title
        }
        PubSub.publish('TransactionProgressModal.open', transactionInfo)
        const result = await this.plcr.revealVote.sendTransaction(pollId, voteOption, salt)
        window.localStorage.setItem('txHash', result)
        await getTxReceiptMined(window.web3, result)

        setTimeout(PubSub.publish('TransactionProgressModal.next', transactionInfo), 8e3)

        store.dispatch({
          type: 'PLCR_VOTE_REVEAL',
          pollId
        })
        resolve(result)
      } catch (error) {
        PubSub.publish('TransactionProgressModal.error')
        reject(error)
        return false
      }
    })
  }

  async requestVotingRights (tokens) {
    const result = this.plcr.requestVotingRights.sendTransaction(tokens)
    window.localStorage.setItem('txHash', result)
    await getTxReceiptMined(window.web3, result)

    store.dispatch({
      type: 'PLCR_REQUEST_VOTING_RIGHTS',
      tokens
    })

    return result
  }

  async getTokensCommited (pollId) {
    return new Promise(async (resolve, reject) => {
      try {
        const numTokens = await this.plcr.getNumTokens(pollId)
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
      if (!tokens) {
        reject(new Error('Tokens is required'))
        return false
      }

      try {
        const result = await this.plcr.hasEnoughTokens(tokens)
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
      try {
        const result = await this.plcr.pollEnded(pollId)
        resolve(result)
        return false
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async getCommitHash (voter, pollId) {
    return new Promise(async (resolve, reject) => {
      try {
        const hash = await this.plcr.getCommitHash(voter, pollId)
        resolve(hash)
      } catch (error) {
        reject(error)
      }
    })
  }

  async hasBeenRevealed (voter, pollId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.plcr.didReveal(voter, pollId)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  async rescueTokens (pollId) {
    try {
      let result = await this.plcr.rescueTokens.sendTransaction(pollId)
      window.localStorage.setItem('txHash', result)
      await getTxReceiptMined(window.web3, result)

      return result
    } catch (error) {
      console.log('Rescue tokens error: ', error)
      throw error
    }
  }

  // async getTransactionReceipt (tx) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const result = await pify(window.web3.eth.getTransactionReceipt)(tx)
  //       resolve(result)
  //       return false
  //     } catch (error) {
  //       reject(error)
  //       return false
  //     }
  //   })
  // }

  async withdrawVotingRights (tokens) {
    const tx = await this.plcr.withdrawVotingRights.sendTransaction(tokens)
    window.localStorage.setItem('txHash', tx)
    await getTxReceiptMined(window.web3, tx)

    store.dispatch({
      type: 'PLCR_WITHDRAW_VOTING_RIGHTS',
      tokens
    })
  }

  async getTokenBalance () {
    return this.plcr.voteTokenBalance.call(this.account)
  }

  async getAvailableTokensToWithdraw () {
    const balance = await this.plcr.voteTokenBalance.call(this.account)
    const lockedTokens = await this.plcr.getLockedTokens(this.account)
    const availableTokens = balance - lockedTokens

    return availableTokens
  }

  async getLockedTokens () {
    const lockedTokens = await this.plcr.getLockedTokens(this.account)

    return lockedTokens
  }

  getAccount () {
    if (!window.web3) {
      return null
    }

    return window.web3.eth.defaultAccount
  }
}

export default new PlcrService()

import sha3 from 'solidity-sha3'
import pify from 'pify'
import keyMirror from 'key-mirror'
import tc from 'truffle-contract' // truffle-contract

import store from '../store'
import token from './token'
import plcr from './plcr'
import parameterizer from './parameterizer'
import saltHashVote from '../utils/saltHashVote'
import { getAddress } from '../config'
import Registry from '../config/registry.json'

const address = getAddress('registry')

// TODO
// Web3 fires 2 callbacks; 2nd callback is when it's mined
function pify2nd (fn) {
  return () => {
    const args = [].slice.call(arguments)
    let n = 0
    return new Promise((resolve, reject) => {
      fn.call(args, (error, result) => {
        if (n === 1) {
          resolve(result)
          return false
        }

        if (error) {
          reject(error)
          return false
        }

        n++
      })
    })
  }
}

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
  }

  async initContract () {
    if (window.web3 === undefined) {
      return false
    }

    this.registry = tc(Registry);
    this.registry.setProvider(window.web3.currentProvider);
    this.registry = await this.registry.deployed();

    this.setUpEvents()
  }

  setUpEvents () {
    this.registry.allEvents()
      .watch((error, log) => {
        if (error) {
          console.error(error)
          return false
        }

        store.dispatch({
          type: 'REGISTRY_EVENT'
        })
      })
  }

  getAccount () {
    if (!window.web3) {
      return null
    }

    return window.web3.eth.defaultAccount
  }

  async apply (domain, deposit = 0) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    if (!this.registry) {
      await this.initContract()
    }

    domain = domain.toLowerCase()
    deposit = deposit * Math.pow(10, token.decimals)

    const exists = await this.applicationExists.call(domain)

    if (exists) {
      throw new Error('Application already exists')
    }

    try {
      await token.approve(this.address, deposit)
    } catch (error) {
      throw error
    }

    try {
      await this.registry.apply(domain, deposit)
    } catch (error) {
      throw error
    }

    store.dispatch({
      type: 'REGISTRY_DOMAIN_APPLY',
      domain
    })
  }

  async challenge (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    await this.initContract()

    domain = domain.toLowerCase()
    let minDeposit = 0

    try {
      minDeposit = await this.getMinDeposit()
      minDeposit = minDeposit * Math.pow(10, token.decimals)
    } catch (error) {
      throw error
    }

    try {
      await token.approve(this.address, minDeposit)
    } catch (error) {
      throw error
    }

    try {
      const receipt = await this.registry.challenge(domain)
      // const challengeId = parseInt(receipt.logs[1].data, 16)

      store.dispatch({
        type: 'REGISTRY_DOMAIN_CHALLENGE',
        domain
      })
    } catch (error) {
      throw error
    }
  }

  async didChallenge (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    await this.initContract()

    domain = domain.toLowerCase()
    let challengeId = null

    try {
      challengeId = await this.getChallengeId.call(domain)
    } catch (error) {
      throw error
    }

    try {
      const challenge = await this.getChallenge.call(challengeId)
      return (challenge.challenger === this.getAccount())
    } catch (error) {
      throw error
    }
  }

  async applicationExists (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    await this.initContract()

    domain = domain.toLowerCase()

    try {
      return this.registry.appExists(domain)
    } catch (error) {
      throw error
    }
  }

  async getListing (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    await this.initContract()

    domain = domain.toLowerCase()

    try {
      const hash = sha3(domain)
      const result = await this.registry.listingMap.call(hash)

      const map = {
        applicationExpiry: result[0].toNumber(),
        isWhitelisted: result[1],
        ownerAddress: result[2],
        currentDeposit: result[3].toNumber(),
        challengeId: result[4].toNumber()
      }

      return map
    } catch (error) {
      throw error
    }
  }

  async getChallenge (challengeId) {
    if (!challengeId) {
      throw new Error('Challenge ID is required')
    }

    await this.initContract()

    try {
      const challenge = await this.registry.challengeMap.call(challengeId)
      const map = {
        // (remaining) pool of tokens distributed amongst winning voters
        rewardPool: challenge[0] ? challenge[0].toNumber() : 0,
        // owner of challenge
        challenger: challenge[1],
        // indication of if challenge is resolved
        resolved: challenge[2],
        // number of tokens at risk for either party during challenge
        stake: challenge[3] ? challenge[3].toNumber() : 0,
        // (remaining) amount of tokens used for voting by the winning side
        totalTokens: challenge[4]
      }

      return map
    } catch (error) {
      throw error
    }
  }

  async getChallengeId (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    domain = domain.toLowerCase()

    await this.initContract();

    try {
      const listing = await this.getListing(domain)

      const {
        challengeId
      } = listing

      return challengeId
    } catch (error) {
      throw error
    }
  }

  async isWhitelisted (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    await this.initContract()

    domain = domain.toLowerCase()

    try {
      return this.registry.isWhitelisted.call(domain)
    } catch (error) {
      throw error
    }
  }

  async updateStatus (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    await this.initContract()

    domain = domain.toLowerCase()

<<<<<<< HEAD
      try {
        const result = await pify(this.registry.updateStatus)(domain)
        this.forceMine()
=======
    try {
      const result = await this.registry.updateStatus(domain)
>>>>>>> 2f536e917f665ec644fe4fb609ff76dbc4aa9655

      store.dispatch({
        type: 'REGISTRY_DOMAIN_UPDATE_STATUS',
        domain
      })

      return result
    } catch (error) {
      throw error
    }
  }

  async getParameter (name) {
    return new Promise(async (resolve, reject) => {
      if (!name) {
        reject(new Error('Parameter name is required'))
        return false
      }

      if (!this.registry) {
        await this.initContract()
      }

      try {
        const value = await parameterizer.get(name)
        resolve(value)
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  getParameterKeys () {
    return Promise.resolve(parameters)
  }

  async getMinDeposit () {
    const min = await this.getParameter('minDeposit')
    return min / Math.pow(10, token.decimals)
  }

  async getCurrentBlockNumber () {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        await this.initContract()
      }

      const result = await pify(window.web3.eth.getBlockNumber)()

      resolve(result)
    })
  }

  async getCurrentBlockTimestamp () {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        await this.initContract()
      }

      try {
        const result = await pify(window.web3.eth.getBlock)('latest')

        resolve(result.timestamp)
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async getPlcrAddress () {
    await this.initContract()

    try {
      return this.registry.voting.call()
    } catch (error) {
      throw error
    }
  }

  async commitPeriodActive (domain) {
    if(!domain) {
      throw new Error('Domain is required')
    }

    await this.initContract()

    domain = domain.toLowerCase()
    let pollId = null

    try {
      pollId = await this.getChallengeId(domain)
    } catch (error) {
      throw error
    }

    if (!pollId) {
      return false
    }

    try {
      return plcr.commitPeriodActive(pollId)
    } catch (error) {
      throw error
    }
  }

  async revealPeriodActive (domain) {
    await this.initContract()

    if (!domain) {
      throw new Error('Domain is required')
    }

    domain = domain.toLowerCase()
    let pollId = null

    try {
      pollId = await this.getChallengeId(domain)
    } catch (error) {
      throw error
    }

    if (!pollId) {
      return false
    }

    try {
      return plcr.revealPeriodActive(pollId)
    } catch (error) {
      throw error
    }
  }

  async commitVote ({domain, votes, voteOption, salt}) {
    await this.initContract()

    if (!domain) {
      throw new Error('Domain is required')
    }

    domain = domain.toLowerCase()
    let challengeId = null

    try {
      challengeId = await this.getChallengeId(domain)
    } catch (error) {
      throw error
    }

    try {
      const hash = saltHashVote(voteOption, salt)

      await plcr.commit({pollId: challengeId, hash, tokens: votes})
      return this.didCommitForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  async revealVote ({domain, voteOption, salt}) {
    await this.initContract()

    domain = domain.toLowerCase()
    let challengeId = null

    try {
      challengeId = await this.getChallengeId(domain)
    } catch (error) {
      throw error
    }

    try {
      await plcr.reveal({pollId: challengeId, voteOption, salt})
      return this.didRevealForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  async getChallengePoll (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    domain = domain.toLowerCase()

    try {
      const challengeId = await this.getChallengeId(domain)
      return plcr.getPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  async pollEnded (domain) {
    domain = domain.toLowerCase()
    const challengeId = await this.getChallengeId(domain)

    if (!challengeId) {
      return false
    }

    try {
      return plcr.pollEnded(challengeId)
    } catch (error) {
      throw error
    }
  }

  async getCommitHash (domain) {
<<<<<<< HEAD
    return new Promise(async (resolve, reject) => {
      domain = domain.toLowerCase()

      try {
        const challengeId = await this.getChallengeId(domain)
        const hash = await plcr.getCommitHash(challengeId)
        resolve(hash)
      } catch (error) {
        reject(error)
      }
    })
  }

  async didCommit (domain) {
    return new Promise(async (resolve, reject) => {
      domain = domain.toLowerCase()

      try {
        const challengeId = await this.getChallengeId(domain)
        const hash = await plcr.getCommitHash(challengeId)
        let didCommit = false

        if (hash !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
          didCommit = true
        }

        resolve(didCommit)
      } catch (error) {
        reject(error)
      }
    })
  }

  async didReveal (domain) {
    return new Promise(async (resolve, reject) => {
      domain = domain.toLowerCase()

      try {
        const challengeId = await this.getChallengeId(domain)
        const didReveal = await plcr.hasBeenRevealed(challengeId)
        resolve(didReveal)
      } catch (error) {
        reject(error)
      }
    })
=======
    domain = domain.toLowerCase()
    const voter = this.getAccount()

    if (!voter) {
      return false
    }

    try {
      const challengeId = await this.getChallengeId(domain)
      return plcr.getCommitHash(voter, challengeId)
    } catch (error) {
      throw error
    }
  }

  async didCommit (domain) {
    domain = domain.toLowerCase()

    try {
      const challengeId = await this.getChallengeId(domain)
      return this.didCommitForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  async didCommitForPoll (pollId) {
    try {
      const voter = this.getAccount()

      if (!voter) {
        return false
      }

      const hash = await plcr.getCommitHash(voter, pollId)
      let committed = false

      if (hash !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
        committed = true
      }

      return committed
    } catch (error) {
      throw error
    }
  }

  async didReveal (domain) {
    domain = domain.toLowerCase()

    const voter = this.getAccount()

    if (!voter) {
      return false
    }

    try {
      const challengeId = await this.getChallengeId(domain)

      if (!challengeId) {
        return false
      }

      return plcr.hasBeenRevealed.call(voter, challengeId)
    } catch (error) {
      throw error
    }
  }

  async didRevealForPoll (pollId) {
    try {
      if (!pollId) {
        return false
      }

      const voter = this.getAccount()

      if (!voter) {
        return false
      }

      return plcr.hasBeenRevealed.call(voter, pollId)
    } catch (error) {
      throw error
    }
>>>>>>> 2f536e917f665ec644fe4fb609ff76dbc4aa9655
  }

  voterHasEnoughVotingTokens (tokens) {
    return plcr.hasEnoughTokens(tokens)
  }

  async didClaim (domain) {
    try {
      const challengeId = await this.getChallengeId.call(domain)
      const account = window.web3.eth.accounts[0]
      return this.registry.tokenClaims.call(challengeId, account)
    } catch (error) {
      throw error
    }
  }

  didClaimForPoll (challengeId) {
    return new Promise(async (resolve, reject) => {
      try {
        const account = window.web3.eth.accounts[0]
        const hasClaimed = await this.registry.tokenClaims.call(challengeId, account)
        resolve(hasClaimed)
      } catch (error) {
        reject(error)
      }
    })
  }

  claimReward (challengeId, salt) {
    return new Promise(async (resolve, reject) => {
      try {
        await pify(this.registry.claimReward)(challengeId, salt)

        store.dispatch({
          type: 'REGISTRY_CLAIM_REWARD'
        })

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  async getTransaction (tx) {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        await this.initContract()
      }

      try {
        const result = await pify(window.web3.eth.getTransaction)(tx)
        resolve(result)
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

  async getTransactionReceipt (tx) {
    return new Promise(async (resolve, reject) => {
      if (!this.registry) {
        await this.initContract()
      }

      try {
        const result = await pify(window.web3.eth.getTransactionReceipt)(tx)
        resolve(result)
      } catch (error) {
        reject(error)
        return false
      }
    })
  }

}

export default new RegistryService()

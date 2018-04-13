import Eth from 'ethjs'
import keyMirror from 'key-mirror'
import detectNetwork from 'web3-detect-network'
import moment from 'moment-timezone'
import { soliditySHA3 } from 'ethereumjs-abi'
import store from '../store'
import token from './token'
import plcr from './plcr'
import parameterizer from './parameterizer'
import saltHashVote from '../utils/saltHashVote'
import { getRegistry } from '../config'
import { getProvider, getWebsocketProvider } from './provider'
import PubSub from 'pubsub-js'
// import { runInThisContext } from 'vm'

// TODO: check number param
const big = (number) => new Eth.BN(number.toString(10))
const tenToTheNinth = big(10).pow(big(9))
const tenToTheEighteenth = big(10).pow(big(18))

const parameters = keyMirror({
  minDeposit: null,
  applyStageLen: null,
  voteQuorum: null,
  commitStageLen: null,
  revealStageLen: null
})

class RegistryService {
  constructor () {
    this.registry = null
    this.account = null
    this.address = null
  }

  async init () {
    /*
     * important to check for provider in
     * init function (rather than constructor),
     * so that injected web3 has time to load.
    */
    try {
      this.provider = getProvider()
      this.eth = new Eth(getProvider())
      const accounts = await this.eth.accounts()
      this.account = accounts[0]
      this.registry = await getRegistry(this.account)
      this.address = this.registry.address
      plcr.init()

      this.setUpEvents()
      this.setAccount()

      store.dispatch({
        type: 'REGISTRY_CONTRACT_INIT'
      })
    } catch (error) {
      console.log('Error initializing Registry Service')
    }
  }

  async setUpEvents () {
    try {
      // websocket provider required for events
      const provider = getWebsocketProvider()
      const registry = await getRegistry(null, provider)

      registry.allEvents()
        .watch((error, log) => {
          if (error) {
            console.error(error)
            return false
          }

          store.dispatch({
            type: 'REGISTRY_EVENT'
          })
        })
    } catch (error) {
      console.error(error)
    }
  }

  async setAccount () {
    const accounts = await this.eth.accounts()

    if (window.web3 && !window.web3.eth.defaultAccount) {
      window.web3.eth.defaultAccount = accounts[0]
    }
  }

  getAccount () {
    return this.account
  }

  // When applying a domain, the `data` parameter must be set to the domain's name
  // The 'domain' parameter will be also be the domain name but it will be hashed in this function before it hits the contract
  async apply (domain, deposit = 0, data = '') {
    if (!domain) {
      throw new Error('Domain is required')
    }

    domain = domain.toLowerCase()
    data = domain

    const exists = await this.applicationExists(domain)

    const bigDeposit = big(deposit).mul(tenToTheNinth).toString(10)
    const hash = `0x${soliditySHA3(['bytes32'], [domain.toLowerCase().trim()]).toString('hex')}`

    if (exists) {
      throw new Error('Application already exists')
    }

    let allowed = await (await token.allowance(this.account, this.address)).toString(10)

    let transactionInfo = {}
    if (allowed < bigDeposit) {
      // if what you pre approved is less than the min deposit
      // open not approved adt modal
      transactionInfo = {
        src: 'not_approved_application',
        title: 'application'
      }
      try {
        PubSub.publish('TransactionProgressModal.open', transactionInfo)
        await token.approve(this.address, bigDeposit)
        PubSub.publish('TransactionProgressModal.next', transactionInfo)
      } catch (error) {
        PubSub.publish('TransactionProgressModal.error')
        throw error
      }
    } else {
      // open approved adt modal
      transactionInfo = {
        src: 'approved_application',
        title: 'application'
      }
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
    }

    try {
      await this.registry.apply(hash, bigDeposit, data)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)
    } catch (error) {
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }

    store.dispatch({
      type: 'REGISTRY_DOMAIN_APPLY',
      domain
    })
  }

  async deposit (domain, amount = 0) {
    if (!domain) {
      throw new Error('Domain is required')
    }
    if (!amount) {
      throw new Error('You did not specify an amount')
    }

    domain = domain.toLowerCase()
    const domainHash = `0x${soliditySHA3(['bytes32'], [domain]).toString('hex')}`
    const bigDeposit = big(amount).mul(tenToTheNinth).toString(10)
    let allowed = await (await token.allowance(this.account, this.address)).toString(10)

    let transactionInfo = {}
    if (allowed <= bigDeposit) {
      // if what you pre-approved is less than or equal to the amount you want to deposit
      transactionInfo = {
        src: 'not_approved_deposit_ADT',
        title: 'Deposit ADT'
      }
      try {
        PubSub.publish('TransactionProgressModal.open', transactionInfo)
        await token.approve(this.address, bigDeposit)
        PubSub.publish('TransactionProgressModal.next', transactionInfo)
      } catch (error) {
        PubSub.publish('TransactionProgressModal.error')
        throw error
      }
    } else {
      // what you pre-approved is greater than deposit amount
      transactionInfo = {
        src: 'approved_deposit_ADT',
        title: 'Deposit ADT'
      }
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
    }

    try {
      await this.registry.deposit(domainHash, bigDeposit)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)
    } catch (error) {
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }
  }

  async challenge (domain, data) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    domain = domain.toLowerCase()
    const domainHash = `0x${soliditySHA3(['bytes32'], [domain.toLowerCase().trim()]).toString('hex')}`

    let allowed = await (await token.allowance(this.account, this.address)).toString(10)
    const minDeposit = await this.getMinDeposit()
    const minDepositAdt = minDeposit.mul(tenToTheNinth)

    let transactionInfo = {}
    if (allowed < minDeposit) {
      // open not approved adt challenge modal
      try {
        transactionInfo = {
          src: 'not_approved_challenge',
          title: 'challenge'
        }
        PubSub.publish('TransactionProgressModal.open', transactionInfo)
        await token.approve(this.address, minDepositAdt)
        PubSub.publish('TransactionProgressModal.next', transactionInfo)
      } catch (error) {
        console.error(error)
        PubSub.publish('TransactionProgressModal.error')
        throw error
      }
    } else {
      // open approved adt challenge modal
      transactionInfo = {
        src: 'approved_challenge',
        title: 'challenge'
      }
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
    }

    try {
      await this.registry.challenge(domainHash, data)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)
    } catch (error) {
      console.error(error)
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }

    store.dispatch({
      type: 'REGISTRY_DOMAIN_CHALLENGE',
      domain
    })
  }

  async didChallenge (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    domain = domain.toLowerCase()
    let challengeId = null

    try {
      challengeId = await this.getChallengeId(domain)
    } catch (error) {
      console.error('getchallengeid error: ', error)
      throw error
    }

    try {
      const challenge = await this.getChallenge(challengeId)
      return (challenge.challenger === this.account)
    } catch (error) {
      console.error('getchallenge error: ', error)
      throw error
    }
  }

  async applicationExists (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    domain = domain.toLowerCase()
    const hash = `0x${soliditySHA3(['bytes32'], [domain.toLowerCase().trim()]).toString('hex')}`

    try {
      return this.registry.appWasMade(hash)
    } catch (error) {
      throw error
    }
  }

  async getListing (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    try {
      domain = domain.toLowerCase()

      const hash = `0x${soliditySHA3(['bytes32'], [domain.toLowerCase().trim()]).toString('hex')}`
      const result = await this.registry.listings.call(hash)

      const map = {
        applicationExpiry: result[0].toNumber() <= 0 ? null : moment.tz(result[0].toNumber(), moment.tz.guess()),
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

    try {
      const challenge = await this.registry.challenges.call(challengeId)
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
    // opens refresh loading modal

    domain = domain.toLowerCase()
    const domainHash = `0x${soliditySHA3(['bytes32'], [domain]).toString('hex')}`

    try {
      let transactionInfo = {
        src: 'refresh',
        title: 'refresh'
      }
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      const result = await this.registry.updateStatus(domainHash)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)

      store.dispatch({
        type: 'REGISTRY_DOMAIN_UPDATE_STATUS',
        domain
      })

      return result
    } catch (error) {
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }
  }

  async getParameter (name) {
    return new Promise(async (resolve, reject) => {
      if (!name) {
        reject(new Error('Parameter name is required'))
        return false
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
    try {
      const min = await this.getParameter('minDeposit')
      return min.div(tenToTheNinth)
    } catch (error) {
      console.log('error getting min deposit')
    }
  }

  // async getCurrentBlockNumber () {
  //   return new Promise(async (resolve, reject) => {
  //     const result = await pify(window.web3.eth.getBlockNumber)()

  //     resolve(result)
  //   })
  // }

  // async getCurrentBlockTimestamp () {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const result = await pify(window.web3.eth.getBlock)('latest')

  //       resolve(result.timestamp)
  //     } catch (error) {
  //       reject(error)
  //       return false
  //     }
  //   })
  // }

  async getPlcrAddress () {
    try {
      return this.registry.voting.call()
    } catch (error) {
      throw error
    }
  }

  async commitStageActive (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    domain = domain.toLowerCase()
    // const hash = `0x${soliditySHA3(['bytes32'], [domain]).toString('hex')}`

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
      return plcr.commitStageActive(pollId)
    } catch (error) {
      throw error
    }
  }

  async revealStageActive (domain) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    domain = domain.toLowerCase()
    // const hash = `0x${soliditySHA3(['bytes32'], [domain]).toString('hex')}`

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
      return plcr.revealStageActive(pollId)
    } catch (error) {
      throw error
    }
  }

  async commitVote ({domain, votes, voteOption, salt}) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    // nano ADT to normal ADT
    const bigVotes = big(votes).mul(tenToTheNinth).toString(10)

    domain = domain.toLowerCase()
    let challengeId = null

    try {
      challengeId = await this.getChallengeId(domain)
    } catch (error) {
      throw error
    }

    try {
      const hash = saltHashVote(voteOption, salt)

      let transactionInfo = {
        src: 'vote',
        title: 'vote'
      }

      await plcr.commit({pollId: challengeId, hash, tokens: bigVotes}, transactionInfo)
      return this.didCommitForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  async revealVote ({domain, voteOption, salt}) {
    domain = domain.toLowerCase()
    let challengeId = null

    try {
      challengeId = await this.getChallengeId(domain)
    } catch (error) {
      console.error('get challenge id: ', error)
      throw error
    }

    try {
      let transactionInfo = {
        src: 'reveal',
        title: 'reveal'
      }
      await plcr.reveal({pollId: challengeId, voteOption, salt}, transactionInfo)
      return this.didRevealForPoll(challengeId)
    } catch (error) {
      console.error('registry reveal: ', error)
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
      const {
        commitEndDate,
        revealEndDate,
        votesAgainst,
        votesFor
      } = await plcr.getPoll(challengeId)
      let result = {
        // formatting to client's local timezone
        commitEndDate: moment.tz(commitEndDate, moment.tz.guess()),
        revealEndDate: moment.tz(revealEndDate, moment.tz.guess()),
        votesAgainst,
        votesFor
      }
      return result
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
    domain = domain.toLowerCase()
    const voter = this.account

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
      const voter = this.account

      if (!voter) {
        return false
      }

      const hash = await plcr.getCommitHash(voter, pollId)
      let committed = false

      if (parseInt(hash, 16) !== 0) {
        committed = true
      }

      return committed
    } catch (error) {
      throw error
    }
  }

  async didReveal (domain) {
    domain = domain.toLowerCase()

    const voter = this.account

    if (!voter) {
      return false
    }

    try {
      const challengeId = await this.getChallengeId(domain)

      if (!challengeId) {
        return false
      }

      return plcr.hasBeenRevealed(voter, challengeId)
    } catch (error) {
      throw error
    }
  }

  async didRevealForPoll (pollId) {
    try {
      if (!pollId) {
        return false
      }

      const voter = this.account

      if (!voter) {
        return false
      }

      return plcr.hasBeenRevealed(voter, pollId)
    } catch (error) {
      throw error
    }
  }

  voterHasEnoughVotingTokens (tokens) {
    return plcr.hasEnoughTokens(tokens)
  }

  async didClaim (domain) {
    try {
      const challengeId = await this.getChallengeId(domain)
      return await this.didClaimForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  didClaimForPoll (challengeId) {
    return new Promise(async (resolve, reject) => {
      try {
        const hasClaimed = await this.registry.tokenClaims(challengeId, this.account)
        resolve(hasClaimed)
      } catch (error) {
        reject(error)
      }
    })
  }

  claimReward (challengeId, salt) {
    return new Promise(async (resolve, reject) => {
      try {
        const voter = this.account
        const voterReward = (await this.calculateVoterReward(voter, challengeId, salt)).toNumber()
        let transactionInfo = {
          src: 'claim_reward',
          title: 'Claim Reward'
        }
        if (voterReward <= 0) {
          reject(new Error('Account has no reward for challenge ID'))
          return false
        }

        await this.registry.claimReward(challengeId, salt)
        PubSub.publish('TransactionProgressModal.next', transactionInfo)

        store.dispatch({
          type: 'REGISTRY_CLAIM_REWARD'
        })

        resolve()
      } catch (error) {
        PubSub.publish('TransactionProgressModal.error')
        reject(error)
      }
    })
  }

  calculateVoterReward (voter, challengeId, salt) {
    return new Promise(async (resolve, reject) => {
      try {
        const reward = await this.registry.voterReward(voter, challengeId, salt)

        resolve(reward)
      } catch (error) {
        reject(error)
      }
    })
  }

  async requestVotingRights (votes) {
    // normal ADT to nano ADT
    const tokens = big(votes).mul(tenToTheNinth).toString(10)

    try {
      let transactionInfo = {
        src: 'conversion_to_voting_ADT',
        title: 'Conversion to Voting ADT'
      }
      await token.approve(plcr.address, tokens)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)

      await plcr.requestVotingRights(tokens)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)
    } catch (error) {
      console.error('request voting rights error: ', error)
      PubSub.publish('TransactionProgressModal.error')
    }
  }

  async getTotalVotingRights () {
    const tokens = await plcr.getTokenBalance()
    return big(tokens).div(tenToTheNinth)
  }

  async getAvailableTokensToWithdraw () {
    const tokens = await plcr.getAvailableTokensToWithdraw()
    return big(tokens).div(tenToTheNinth)
  }

  async getLockedTokens () {
    const tokens = await plcr.getLockedTokens()
    return big(tokens).div(tenToTheNinth)
  }

  async withdrawVotingRights (tokens) {
    if (!tokens) {
      throw new Error('Number of tokens required')
    }

    tokens = big(tokens).mul(tenToTheNinth).toString(10)

    try {
      let transactionInfo = {
        src: 'withdraw_voting_ADT',
        title: 'Withdraw Voting ADT'
      }
      await plcr.withdrawVotingRights(tokens)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)
    } catch (error) {
      console.error('withdraw voting rights error: ', error)
      PubSub.publish('TransactionProgressModal.error')
    }

    return true
  }

  async approveTokens (tokens) {
    const bigTokens = big(tokens).mul(tenToTheNinth).toString(10)
    return token.approve(this.address, bigTokens)
  }

  async rescueTokens (pollId) {
    try {
      let res = await plcr.rescueTokens(pollId)
      let transactionInfo = {
        src: 'unlock_expired_ADT',
        title: 'Unlock Expired ADT'
      }
      PubSub.publish('TransactionProgressModal.next', transactionInfo)
      return res
    } catch (error) {
      console.log('Rescue tokens error: ', error)
      PubSub.publish('TransactionProgressModal.error')
    }
  }

  async getTokenAllowance () {
    const allowed = await token.allowance(this.account, this.address)
    const bigTokens = big(allowed).div(tenToTheNinth)
    return bigTokens
  }

  // async getTransaction (tx) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const result = await pify(window.web3.eth.getTransaction)(tx)
  //       resolve(result)
  //     } catch (error) {
  //       reject(error)
  //       return false
  //     }
  //   })
  // }

  // async getTransactionReceipt (tx) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const result = await pify(window.web3.eth.getTransactionReceipt)(tx)
  //       resolve(result)
  //     } catch (error) {
  //       reject(error)
  //       return false
  //     }
  //   })
  // }

  async getEthBalance () {
    if (!window.web3) {
      return 0
    }
    const result = await new Promise((resolve, reject) => {
      window.web3.eth.getBalance(this.account, function (err, res) {
        if (res) resolve(res)
        else reject(err)
      })
    })
    return result.div(tenToTheEighteenth)
  }

  async exit (domain) {
    domain = domain.toLowerCase()
    const domainHash = `0x${soliditySHA3(['bytes32'], [domain]).toString('hex')}`

    try {
      let transactionInfo = {
        src: 'withdraw_listing',
        title: 'Withdraw Listing'
      }
      await this.registry.exit(domainHash)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)
    } catch (error) {
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }
  }

  async withdraw (domain, amount = 0) {
    if (!domain) {
      throw new Error('Domain is required')
    }

    domain = domain.toLowerCase()

    const bigWithdrawAmount = big(amount).mul(tenToTheNinth).toString(10)
    const hash = `0x${soliditySHA3(['bytes32'], [domain.toLowerCase().trim()]).toString('hex')}`

    // let allowed = await (await token.allowance(this.account, this.address)).toString(10)

    // if (allowed < bigWithdrawAmount) {
    //   try {
    //     await token.approve(this.address, bigWithdrawAmount)
    //   } catch (error) {
    //     throw error
    //   }
    // }

    try {
      let transactionInfo = {
        src: 'withdraw_ADT',
        title: 'Withdraw ADT'
      }
      await this.registry.withdraw(hash, bigWithdrawAmount)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)
    } catch (error) {
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }
  }

  // async watchApplicationEvent (domain) {
  //   const applicationEvent = this.registry._Application({}, {fromBlock: 0, toBlock: 'latest'})
  //   await applicationEvent.watch((error, result) => {
  //     if(error) {
  //       console.error(error)
  //     } else if (result.args.data === domain) {
  //       console.log('result.args.data', result.args.data)
  //     }
  //   })
  // }

  getNetwork () {
    return detectNetwork(this.provider)
  }
}

export default new RegistryService()

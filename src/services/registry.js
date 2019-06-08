import Eth from 'ethjs'
import keyMirror from 'key-mirror'
import { detectNetwork } from '../utils/detectNetwork'
import moment from 'moment-timezone'
import { soliditySHA3 } from 'ethereumjs-abi'
import store from '../store'
import token from './token'
import plcr from './plcr'
import parameterizer from './parameterizer'
import saltHashVote from '../utils/saltHashVote'
import { getRegistry } from '../config'
import { getProvider } from './provider'
import PubSub from 'pubsub-js'
import { getTxReceiptMined } from '../utils/getTxReceiptMined'
// import { promisify as pify } from 'bluebird'
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
  constructor() {
    this.registry = null
    this.account = null
    this.address = null
  }

  async init() {
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

      // this.setUpEvents()
      this.setAccount()

      store.dispatch({
        type: 'REGISTRY_CONTRACT_INIT'
      })
    } catch (error) {
      console.log('Error initializing Registry Service')
    }
  }

  // async setUpEvents () {
  //   try {
  //     // websocket provider required for events
  //     const provider = getWebsocketProvider()
  //     const registry = await getRegistry(null, provider)

  //     registry.allEvents()
  //       .watch((error, log) => {
  //         if (error) {
  //           console.error(error)
  //           return false
  //         }
  //         store.dispatch({
  //           type: 'REGISTRY_EVENT'
  //         })
  //       })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  async setAccount() {
    const accounts = await this.eth.accounts()
    if (window.web3 && !window.web3.eth.defaultAccount) {
      window.web3.eth.defaultAccount = accounts[0]
    }
  }

  getAccount() {
    return this.account
  }

  // When applying a domain, the `data` parameter must be set to ipfs hash of --> {id: domain name}
  // The 'domain' parameter will be also be the domain name but it will be hashed in this function before it hits the contract
  async apply(domain, deposit = 0, data = '') {
    if (!domain) throw new Error('Domain is required')

    // Check if application exists already
    const exists = await this.applicationExists(domain)

    if (exists) throw new Error('Application already exists')

    const bigDeposit = big(deposit).mul(tenToTheNinth).toString(10)

    // Check to see how much token the user has perviously allowed the registry contract to use.
    let allowed = await (await token.allowance(this.account, this.address)).toString(10)
    // Used for the modal information
    let transactionInfo = {}

    // Open modal for user to supply reason for application.
    PubSub.publish('RedditConfirmationModal.close')

    // If what you previously pre approved is less than the min deposit, approve more token.
    if (Number(allowed) < Number(bigDeposit)) {
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
      // Open approved ADT modal
      transactionInfo = {
        src: 'approved_application',
        title: 'application'
      }
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
    }

    // Hash as string input
    const hash = `0x${soliditySHA3(['string'], [domain]).toString('hex')}`

    try {
      // Apply listing to registry.
      const tx = await this.registry.apply.sendTransaction(hash, bigDeposit, data)
      window.localStorage.setItem('txHash', tx) // setting tx hash of second transaction
      await getTxReceiptMined(window.web3, tx)

      // This will update the domain table and also update the transaction progress modal.
      PubSub.publish('DomainsTable.fetchNewData', transactionInfo)
    } catch (error) {
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }

    store.dispatch({
      type: 'REGISTRY_DOMAIN_APPLY',
      domain
    })
  }

  async deposit(listingHash, amount = 0) {
    if (!listingHash) {
      throw new Error('Domain is required')
    }
    if (!amount) {
      throw new Error('You did not specify an amount')
    }

    const bigDeposit = big(amount).mul(tenToTheNinth).toString(10)
    let allowed = await (await token.allowance(this.account, this.address)).toString(10)

    let transactionInfo = {}

    // If what you pre-approved is less than or equal to the amount you want to deposit
    if (allowed <= bigDeposit) {
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
      const tx = await this.registry.deposit.sendTransaction(listingHash, bigDeposit)
      window.localStorage.setItem('txHash', tx)
      await getTxReceiptMined(window.web3, tx)

      PubSub.publish('TransactionProgressModal.next', transactionInfo)
    } catch (error) {
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }
  }

  async challenge(listingHash, data) {
    if (!listingHash) {
      throw new Error('Domain is required')
    }

    let allowed = await (await token.allowance(this.account, this.address)).toString(10)
    const minDeposit = await this.getMinDeposit()
    const minDepositAdt = minDeposit.mul(tenToTheNinth)

    let transactionInfo = {}

    PubSub.publish('RedditConfirmationModal.close')
    if (Number(allowed) < Number(minDeposit)) {
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
      const tx = await this.registry.challenge.sendTransaction(listingHash, data)
      window.localStorage.setItem('txHash', tx)
      await getTxReceiptMined(window.web3, tx)

      PubSub.publish('TransactionProgressModal.next', transactionInfo)
    } catch (error) {
      console.error(error)
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }

    store.dispatch({
      type: 'REGISTRY_DOMAIN_CHALLENGE',
      listingHash
    })
  }

  async didChallenge(listingHash) {
    if (!listingHash) {
      throw new Error('Domain is required')
    }

    // domain = domain.toLowerCase()
    let challengeId = null

    try {
      challengeId = await this.getChallengeId(listingHash)
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

  async applicationExists(listingHash) {
    if (!listingHash || !this.registry) {
      throw new Error('Domain is required')
    }

    try {
      return this.registry.appWasMade(listingHash)
    } catch (error) {
      throw error
    }
  }

  async getListing(listingHash) {
    try {
      if (!listingHash) throw new Error('Domain is required');
      if (!this.registry) throw new Error('Contract not available');

      const result = await this.registry.listings.call(listingHash)
      const map = {
        applicationExpiry: result[0].toNumber() <= 0 ? null : moment.tz(result[0].toNumber(), moment.tz.guess()),
        isWhitelisted: result[1],
        ownerAddress: result[2],
        currentDeposit: result[3].toNumber(),
        challengeId: result[4].toNumber(),
      }
      return map
    } catch (error) {
      throw error
    }
  }

  async getChallenge(challengeId) {
    if (!challengeId) throw new Error('Challenge ID is required')

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

  // Domain param is listingHash
  async getChallengeId(listingHash) {
    if (!listingHash) throw new Error('Domain is required')

    try {
      const listing = await this.getListing(listingHash)

      const {
        challengeId
      } = listing

      return challengeId
    } catch (error) {
      throw error
    }
  }

  async isWhitelisted(listingHash) {
    if (!listingHash) throw new Error('Domain is required')

    try {
      return this.registry.isWhitelisted.call(listingHash)
    } catch (error) {
      throw error
    }
  }

  async updateStatus(listingHash) {
    if (!listingHash) throw new Error('Domain is required')

    try {
      let transactionInfo = {
        src: 'refresh',
        title: 'refresh'
      }
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      const result = await this.registry.updateStatus.sendTransaction(listingHash)
      window.localStorage.setItem('txHash', result)
      await getTxReceiptMined(window.web3, result)

      PubSub.publish('TransactionProgressModal.next', transactionInfo)

      store.dispatch({
        type: 'REGISTRY_DOMAIN_UPDATE_STATUS',
        listingHash
      })

      return result
    } catch (error) {
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }
  }

  async getParameter(name) {
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

  getParameterKeys() {
    return Promise.resolve(parameters)
  }

  async getMinDeposit() {
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

  async getPlcrAddress() {
    try {
      return this.registry.voting.call()
    } catch (error) {
      throw error
    }
  }

  async commitStageActive(listingHash) {
    if (!listingHash) {
      throw new Error('Domain is required')
    }

    let pollId = null

    try {
      pollId = await this.getChallengeId(listingHash)
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

  async revealStageActive(listingHash) {
    if (!listingHash) {
      throw new Error('Domain is required')
    }

    let pollId = null

    try {
      pollId = await this.getChallengeId(listingHash)
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

  async commitVote({ listingHash, votes, voteOption, salt }) {
    if (!listingHash) {
      throw new Error('listingHash is required')
    }

    // nano ADT to normal ADT
    const bigVotes = big(votes).mul(tenToTheNinth).toString(10)

    // domain = domain.toLowerCase()
    let challengeId = null

    try {
      challengeId = await this.getChallengeId(listingHash)
    } catch (error) {
      throw error
    }

    try {
      const hash = saltHashVote(voteOption, salt)
      let transactionInfo = {
        src: 'vote',
        title: 'vote'
      }

      await plcr.commit({ pollId: challengeId, hash, tokens: bigVotes }, transactionInfo)
      return this.didCommitForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  async revealVote({ listingHash, voteOption, salt }) {
    let challengeId = null

    try {
      challengeId = await this.getChallengeId(listingHash)
    } catch (error) {
      console.error('get challenge id: ', error)
      throw error
    }

    try {
      let transactionInfo = {
        src: 'reveal',
        title: 'reveal'
      }
      const result = await plcr.reveal({ pollId: challengeId, voteOption, salt }, transactionInfo)
      return this.didRevealForPoll(challengeId, result)
    } catch (error) {
      console.error('registry reveal: ', error)
      throw error
    }
  }

  async getChallengePoll(listingHash) {
    if (!listingHash) {
      throw new Error('Domain is required')
    }

    // listingHash = listingHash.toLowerCase()

    try {
      const challengeId = await this.getChallengeId(listingHash)
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

  async pollEnded(listingHash) {
    // listingHash = listingHash.toLowerCase()
    const challengeId = await this.getChallengeId(listingHash)

    if (!challengeId) {
      return false
    }

    try {
      return plcr.pollEnded(challengeId)
    } catch (error) {
      throw error
    }
  }

  async getCommitHash(listingHash) {
    // listingHash = listingHash.toLowerCase()
    const voter = this.account

    if (!voter) {
      return false
    }

    try {
      const challengeId = await this.getChallengeId(listingHash)
      return plcr.getCommitHash(voter, challengeId)
    } catch (error) {
      throw error
    }
  }

  async didCommit(listingHash) {
    // listingHash = listingHash.toLowerCase()

    try {
      const challengeId = await this.getChallengeId(listingHash)
      return this.didCommitForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  async didCommitForPoll(pollId) {
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

  async didReveal(listingHash) {
    // listingHash = listingHash.toLowerCase()

    const voter = this.account

    if (!voter) {
      return false
    }

    try {
      const challengeId = await this.getChallengeId(listingHash)

      if (!challengeId) {
        return false
      }

      return plcr.hasBeenRevealed(voter, challengeId)
    } catch (error) {
      throw error
    }
  }

  async didRevealForPoll(pollId, data) { // data is a param for the result from this.revealvote
    try {
      if (!pollId) {
        return false
      }

      const voter = this.account

      if (!voter) {
        return false
      }
      const revealed = await plcr.hasBeenRevealed(voter, pollId)
      const result = {
        revealed: revealed,
        data: data
      }

      return result
    } catch (error) {
      throw error
    }
  }

  voterHasEnoughVotingTokens(tokens) {
    return plcr.hasEnoughTokens(tokens)
  }

  async didClaim(listingHash) {
    try {
      const challengeId = await this.getChallengeId(listingHash)
      return await this.didClaimForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  didClaimForPoll(challengeId) {
    return new Promise(async (resolve, reject) => {
      try {
        const hasClaimed = await this.registry.tokenClaims(challengeId, this.account)
        resolve(hasClaimed)
      } catch (error) {
        reject(error)
      }
    })
  }

  claimReward(challengeId, salt) {
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

        const tx = await this.registry.claimReward.sendTransaction(challengeId, salt)
        window.localStorage.setItem('txHash', tx)
        await getTxReceiptMined(window.web3, tx)

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

  calculateVoterReward(voter, challengeId, salt) {
    return new Promise(async (resolve, reject) => {
      try {
        const reward = await this.registry.voterReward(voter, challengeId, salt)

        resolve(reward)
      } catch (error) {
        reject(error)
      }
    })
  }

  async requestVotingRights(votes) {
    try {
      let transactionInfo = {
        src: 'conversion_to_voting_ADT',
        title: 'Conversion to Voting ADT'
      }

      // Convert normal ADT to nano ADT
      const tokens = big(votes).mul(tenToTheNinth).toString(10)
      // Check to see if user has previously allowed the plcr contract to use token
      let allowed = await (await token.allowance(this.account, plcr.address)).toString(10)
      // If the token amount they previously approved is greater than or equal to how many votes they are trying to
      // use then no need to approve again. Skip to second tx
      if (Number(allowed) < Number(tokens)) {
        await token.approve(plcr.address, tokens)
        PubSub.publish('TransactionProgressModal.next', transactionInfo)
      } else {
        PubSub.publish('TransactionProgressModal.next', transactionInfo)
      }

      await plcr.requestVotingRights(tokens)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)
    } catch (error) {
      console.error('request voting rights error: ', error)
      PubSub.publish('TransactionProgressModal.error')
    }
  }

  async getTotalVotingRights() {
    const tokens = await plcr.getTokenBalance()
    return big(tokens).div(tenToTheNinth)
  }

  async getAvailableTokensToWithdraw() {
    const tokens = await plcr.getAvailableTokensToWithdraw()
    return big(tokens).div(tenToTheNinth)
  }

  async getLockedTokens() {
    const tokens = await plcr.getLockedTokens()
    return big(tokens).div(tenToTheNinth)
  }

  async withdrawVotingRights(tokens) {
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

  async approveTokens(tokens) {
    const bigTokens = big(tokens).mul(tenToTheNinth).toString(10)
    return token.approve(this.address, bigTokens)
  }

  async rescueTokens(pollId) {
    try {
      let transactionInfo = {
        src: 'unlock_expired_ADT',
        title: 'Unlock Expired ADT'
      }
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      let res = await plcr.rescueTokens(pollId)
      PubSub.publish('TransactionProgressModal.next', transactionInfo)
      return res
    } catch (error) {
      console.log('Rescue tokens error: ', error)
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }
  }

  async getTokenAllowance() {
    const allowed = await token.allowance(this.account, this.address)
    const bigTokens = big(allowed).div(tenToTheNinth)
    return bigTokens
  }

  // async getTransaction (tx) {
  //   console.log("TX: ", tx)
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

  async getEthBalance() {
    if (!window.web3) return 0

    const result = await new Promise((resolve, reject) => {
      window.web3.eth.getBalance(this.account, function (err, res) {
        if (res) resolve(res)
        else reject(err)
      })
    })
    return result.div(tenToTheEighteenth)
  }

  async exit(listingHash) {
    if (!listingHash) throw new Error('listingHash is required')

    try {
      let transactionInfo = {
        src: 'withdraw_listing',
        title: 'Withdraw Listing'
      }
      const tx = await this.registry.exit.sendTransaction(listingHash)
      window.localStorage.setItem('txHash', tx)
      await getTxReceiptMined(window.web3, tx)

      PubSub.publish('TransactionProgressModal.next', transactionInfo)
    } catch (error) {
      PubSub.publish('TransactionProgressModal.error')
      throw error
    }
  }

  async withdraw(listingHash, amount = 0) {
    if (!listingHash) throw new Error('listingHash is required')

    const bigWithdrawAmount = big(amount).mul(tenToTheNinth).toString(10)

    try {
      let transactionInfo = {
        src: 'withdraw_ADT',
        title: 'Withdraw ADT'
      }
      const tx = await this.registry.withdraw.sendTransaction(listingHash, bigWithdrawAmount)
      window.localStorage.setItem('txHash', tx)
      await getTxReceiptMined(window.web3, tx)

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

  getNetwork() {
    return detectNetwork(this.provider)
  }
}

export default new RegistryService()

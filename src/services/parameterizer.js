import Eth from 'ethjs'
import { getProvider } from './provider'
import { getParameterizer } from '../config'
import store from '../store'
import token from './token'
import plcr from './plcr'
import moment from 'moment-timezone'
import saltHashVote from '../utils/saltHashVote'
import PubSub from 'pubsub-js'
import { registryApiURL } from '../models/urls'
import { getTxReceiptMined } from '../utils/getTxReceiptMined'

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
    store.dispatch({
      type: 'PARAMETERIZER_CONTRACT_INIT'
    })
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

  async getProposalsAndPropIds () {
    let proposals = await (await window.fetch(`${registryApiURL}/parameterization/proposals`)).json()

    let propIds = proposals.map(proposal => proposal.prop_id)
    let item
    let result = []
    for (let i = 0; i < propIds.length; i++) {
      try {
        item = await this.parameterizer.proposals.call(propIds[i])
        result.push(item)
      } catch (error) {
        console.log(error)
      }
    }
    return [result, propIds]
  }

  async proposeReparameterization (deposit, name, value) {
    let result
    if (!name || !value) { console.log('name or value missing'); return }
    try {
      const bigDeposit = big(deposit).mul(tenToTheNinth).toString(10)
      const allowed = await (await token.allowance(this.account, this.address)).toString('10')
      let transactionInfo = {}

      if (Number(allowed) < Number(bigDeposit)) {
        // open not approved adt modal
        try {
          transactionInfo = {
            src: 'not_approved_parameter_proposal_application',
            title: 'Parameter Proposal Application'
          }
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
          src: 'approved_parameter_proposal_application',
          title: 'Parameter Proposal Application'
        }
        PubSub.publish('TransactionProgressModal.open', transactionInfo)
      }
      try {
        result = await this.parameterizer.proposeReparameterization.sendTransaction(name, value)
        window.localStorage.setItem('txHash', result)
        await getTxReceiptMined(window.web3, result)

        PubSub.publish('TransactionProgressModal.next', transactionInfo)
      } catch (error) {
        PubSub.publish('TransactionProgressModal.error')
        throw error
      }
    } catch (error) {
      console.log(error)
    }
    return result
  }

  async challengeReparameterization (deposit, propId) {
    let result
    try {
      const bigDeposit = big(deposit).mul(tenToTheNinth).toString(10)
      const allowed = await (await token.allowance(this.account, this.address)).toString('10')

      let transactionInfo = {}
      if (Number(allowed) < Number(bigDeposit)) {
        // open not approved adt modal
        try {
          transactionInfo = {
            src: 'not_approved_parameter_proposal_challenge',
            title: 'Parameter Proposal Challenge'
          }
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
          src: 'approved_parameter_proposal_challenge',
          title: 'Parameter Proposal Challenge'
        }
        PubSub.publish('TransactionProgressModal.open', transactionInfo)
      }

      try {
        result = await this.parameterizer.challengeReparameterization.sendTransaction(propId)
        window.localStorage.setItem('txHash', result)
        await getTxReceiptMined(window.web3, result)

        PubSub.publish('TransactionProgressModal.next', transactionInfo)
        // window.location.reload()
      } catch (error) {
        PubSub.publish('TransactionProgressModal.error')
        throw error
      }
    } catch (error) {
      console.log(error)
    }
    return result
  }

  async propExists (propId) {
    let result
    if (!propId) { console.log('propId missing'); return }
    try {
      result = await this.parameterizer.propExists(propId)
    } catch (error) {
      console.log('error prop exists')
    }
    return result
  }

  // Similar function to updateStatus from registry contract
  // Call this for the refresh status of parameter proposal
  async processProposal (propId) {
    let result
    if (!propId) { console.log('name'); return }
    try {
      // const propId = await this.getPropId(name)
      let transactionInfo = {
        src: 'proposal_refresh',
        title: 'Refresh'
      }
      result = await this.parameterizer.processProposal.sendTransaction(propId)
      window.localStorage.setItem('txHash', result)
      await getTxReceiptMined(window.web3, result)

      PubSub.publish('TransactionProgressModal.next', transactionInfo)
      // window.location.reload()
    } catch (error) {
      console.error(error)
      PubSub.publish('TransactionProgressModal.error')
    }
    return result
  }

  // propIds are fetched from db
  async getPropId (name) {
    try {
      let proposals = await (await window.fetch(`${registryApiURL}/parameterization/proposals`)).json()
      for (let i = 0; i < proposals.length; i++) {
        if (proposals[i].name === name) {
          return proposals[i].prop_id
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  /*
 * ------------------------------------------------
 * The below funcitons are specific to PLCR voting,
 * rewards and determining a proposal's current state
 * ------------------------------------------------
*/

  async getPlcrAddress () {
    try {
      return this.parameterizer.voting.call()
    } catch (error) {
      throw error
    }
  }

  async commitStageActive (propId) {
    if (!propId) {
      throw new Error('Parameter is required')
    }

    let pollId = null

    try {
      pollId = await this.getChallengeId(propId)
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

  async revealStageActive (propId) {
    if (!propId) {
      throw new Error('Domain is required')
    }

    // const hash = `0x${soliditySHA3(['string'], [domain]).toString('hex')}`

    let challengeId = null

    try {
      challengeId = await this.getChallengeId(propId)
    } catch (error) {
      throw error
    }

    if (!challengeId) {
      return false
    }

    try {
      return plcr.revealStageActive(challengeId)
    } catch (error) {
      throw error
    }
  }

  async commitVote ({challengeId, propId, votes, voteOption, salt}) {
    if (!propId) {
      throw new Error('PropId is required')
    }

    // nano ADT to normal ADT
    const bigVotes = big(votes).mul(tenToTheNinth).toString(10)

    try {
      const hash = saltHashVote(voteOption, salt)
      let transactionInfo = {
        src: 'vote_commit_for_parameter_proposal',
        title: 'Vote for Parameter Proposal'
      }

      await plcr.commit({pollId: challengeId, hash, tokens: bigVotes}, transactionInfo)
      return this.didCommitForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  async revealVote ({challengeId, propId, voteOption, salt}) {
    try {
      let transactionInfo = {
        src: 'vote_reveal_for_parameter_proposal',
        title: 'Reveal for Parameter Proposal'
      }
      await plcr.reveal({pollId: challengeId, voteOption, salt}, transactionInfo)
      return this.didRevealForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  async getChallengePoll (challengeId, propId) {
    if (!propId) {
      throw new Error('Parameter is required')
    }

    try {
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
      // console.log(`No challenge for this proposal. Poll ID: ${challengeId}. Or incorrect data sent to contract`)
      throw error
    }
  }

  async pollEnded (challengeId, propId) {
    if (!challengeId) {
      return false
    }

    try {
      return plcr.pollEnded(challengeId)
    } catch (error) {
      throw error
    }
  }

  async getCommitHash (challengeId, propId) {
    const voter = this.account

    if (!voter) {
      return false
    }

    try {
      return plcr.getCommitHash(voter, challengeId)
    } catch (error) {
      throw error
    }
  }

  async didCommit (challengeId) {
    try {
      return this.didCommitForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  async didCommitForPoll (challengeId) {
    try {
      const voter = this.account

      if (!voter) {
        return false
      }

      const hash = await plcr.getCommitHash(voter, challengeId)
      let committed = false

      if (parseInt(hash, 16) !== 0) {
        committed = true
      }

      return committed
    } catch (error) {
      throw error
    }
  }

  async didReveal (challengeId, propId) {
    const voter = this.account

    if (!voter) {
      return false
    }

    try {
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

  async didClaim (challengeId) {
    try {
      return await this.parameterizer.challenges.call(challengeId)
    } catch (error) {
      throw error
    }
  }

  claimReward (challengeId, salt) {
    return new Promise(async (resolve, reject) => {
      try {
        const voter = this.account
        const voterReward = (await this.calculateVoterReward(voter, challengeId, salt)).toNumber()

        if (voterReward <= 0) {
          reject(new Error('Account has no reward for challenge ID'))
          return false
        }

        let transactionInfo = {
          src: 'claim_governance_reward',
          title: 'Claim Governance Reward'
        }

        const tx = await this.parameterizer.claimReward.sendTransaction(challengeId, salt)
        window.localStorage.setItem('txHash', tx)
        await getTxReceiptMined(window.web3, tx)

        PubSub.publish('TransactionProgressModal.next', transactionInfo)

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
        const reward = await this.parameterizer.voterReward(voter, challengeId, salt)

        resolve(reward)
      } catch (error) {
        reject(error)
      }
    })
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
  async getChallenge (challengeId) {
    if (!challengeId) {
      throw new Error('Challenge ID is required')
    }

    try {
      const challenge = await this.parameterizer.challenges.call(challengeId)
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

  async getChallengeId (propId) {
    if (!propId) {
      throw new Error('Domain is required')
    }

    try {
      const paramProposal = await this.parameterizer.proposals.call(propId)
      const challengeId = paramProposal[1].c[0]
      return challengeId
    } catch (error) {
      throw error
    }
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

  async rescueTokens (pollId) {
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
}

export default new ParameterizerService()

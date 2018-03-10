import Eth from 'ethjs'
import { getProvider } from './provider'
import { getParameterizer } from '../config'
import store from '../store'
import token from './token'
import plcr from './plcr'
import moment from 'moment-timezone'
import saltHashVote from '../utils/saltHashVote'

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
    let proposals = await (await window.fetch(`https://adchain-registry-api-staging.metax.io/parameterization/proposals`)).json()

    let propIds = proposals.map(proposal => {
      return proposal.prop_id
    })

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
      const allowed = await token.allowance(this.account, this.address).toString('10')

      if (allowed >= bigDeposit) {
        try {
          await token.approve(this.address, bigDeposit)
        } catch (error) {
          throw error
        }
      }
      result = await this.parameterizer.proposeReparameterization(name, value)
    } catch (error) {
      console.log(error)
    }
    return result
  }

  async challengeReparameterization (deposit, propId) {
    let result
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
      result = await this.parameterizer.challengeReparameterization(propId)
      window.location.reload()
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
      result = await this.parameterizer.processProposal(propId)
      window.location.reload()
    } catch (error) {
      console.log('error prop exists')
    }
    return result
  }

  // propIds are fetched from db
  async getPropId (name) {
    try {
      let proposals = await (await window.fetch(`https://adchain-registry-api-staging.metax.io/parameterization/proposals`)).json()
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

    // const hash = `0x${soliditySHA3(['bytes32'], [domain]).toString('hex')}`

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

      await plcr.commit({pollId: challengeId, hash, tokens: bigVotes})
      return this.didCommitForPoll(challengeId)
    } catch (error) {
      throw error
    }
  }

  async revealVote ({challengeId, propId, voteOption, salt}) {
    try {
      await plcr.reveal({pollId: challengeId, voteOption, salt})
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
      console.log(error)
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

        await this.parameterizer.claimVoterReward(challengeId, salt)

        resolve()
      } catch (error) {
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
}

export default new ParameterizerService()

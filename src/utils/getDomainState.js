import React from 'react'
import registry from '../services/registry'
import moment from 'moment'
// import  {registryApiURL} from "../models/urls"

function isExpired (end) {
  const now = moment().unix()
  if (!end) return false
  return end < now
}

const getDomainState = async (data) => {
  if (!data || !data.domainHash) return {}
  const item = {
    domain: data.domain,
    color: '',
    stage: null,
    stats: null,
    label: null,
    action: null,
    stageEnds: null,
    challenged: null,
    actionLabel: null,
    stageMapSrc: null,
    stageEndsTimestamp: null,
    siteName: data.domain,
    listingHash: data.domainHash
  }

  try {
    const listing = await registry.getListing(item.listingHash)
    const { applicationExpiry, isWhitelisted, challengeId, ownerAddress, currentDeposit } = listing
    const applicationExists = !!applicationExpiry
    const challengeOpen = (challengeId === 0 && !isWhitelisted && applicationExpiry)
    const commitOpen = await registry.commitStageActive(item.listingHash)
    const revealOpen = await registry.revealStageActive(item.listingHash)
    const isInRegistry = (isWhitelisted)

    item.challengeId = challengeId
    item.ownerAddress = ownerAddress
    item.challenged = challengeId > 0
    item.isWhitelisted = isWhitelisted
    item.currentDeposit = currentDeposit
    item.applicationExpiry = applicationExpiry

    // -----------------------------------------------------------
    // -------------------In Registry States----------------------
    // -----------------------------------------------------------

    if (isInRegistry || (commitOpen && isWhitelisted) || (revealOpen && isWhitelisted)) {
      if (challengeId) {
        // This is logic to determine the following state:
        // Applied --> PLCR Stuff --> In Registry --> Challenged --> ....
        // Checks to see if challenge is resolved by challenge ID

        const challenge = await registry.getChallenge(challengeId)

        if (commitOpen) {
          let { commitEndDate } = await registry.getChallengePoll(item.listingHash)
          item.stage = 'in_registry_in_commit'
          item.stageEndsTimestamp = commitEndDate
          item.stageEnds = moment.unix(commitEndDate).format('YYYY-MM-DD HH:mm:ss')
          item.color = 'blue'
          item.actionLabel = 'VOTE'
          item.label = <span><i className='icon check circle' /> <strong>|&nbsp;</strong> Voting - Commit</span>
          item.stageMapSrc = 'MapInRegistryCommit'
        } else if (revealOpen) {
          let { revealEndDate, votesFor, votesAgainst } = await registry.getChallengePoll(item.listingHash)
          item.stage = 'in_registry_in_reveal'
          item.stageEndsTimestamp = revealEndDate
          item.stageEnds = moment.unix(revealEndDate).format('YYYY-MM-DD HH:mm:ss')
          item.stats = { votesFor, votesAgainst }
          item.label = <span><i className='icon check circle' /> <strong>|&nbsp;</strong> Voting - Reveal</span>
          item.color = 'green'
          item.actionLabel = 'REVEAL'
          item.stageMapSrc = 'MapInRegistryReveal'
        } else if (challenge.resolved !== true) {
          item.stage = 'in_registry_update_status'
          item.deposit = listing.currentDeposit
          item.label = <span><i className='icon check circle' /> <strong>|&nbsp;</strong> Pending</span>
          item.color = 'greyblack'
          item.actionLabel = 'REFRESH'
          item.stageMapSrc = 'MapInRegistryRevealPending'
        } else {
          item.stage = 'in_registry'
          item.deposit = listing.currentDeposit
          item.label = <span><i className='icon check circle' />In Registry</span>
          item.stageMapSrc = 'MapInRegistryNoChallengeId'
        }
      } else {
        if (item.challenged) {
          item.stageMapSrc = 'MapInRegistryChallengeId'
        } else {
          item.stageMapSrc = 'MapInRegistryNoChallengeId'
        }
        item.deposit = listing.currentDeposit
        item.stage = 'in_registry'
        item.label = <span><i className='icon check circle' />In Registry</span>
      }

      // --------------------------------------------------------------
      // ----------------In Application States-------------------------
      // --------------------------------------------------------------
    } else if (challengeOpen) {
      if (isExpired(applicationExpiry)) {
        item.actionLabel = 'REFRESH'
        item.color = 'greyblack'
        item.stageMapSrc = 'MapInApplicationPending'
        item.label = <span><i className='icon circle thin' />App - Pending</span>
        item.stage = 'in_application_pending'
      } else {
        item.label = <span><i className='icon wait' />In Application</span>
        item.color = 'red'
        item.stage = 'in_application'
        item.actionLabel = 'CHALLENGE'
        item.stageMapSrc = 'MapInApplication'
      }
      item.stageEndsTimestamp = applicationExpiry
      item.stageEnds = moment.unix(applicationExpiry).format('YYYY-MM-DD HH:mm:ss')

      // -----------------------------------------
      // -----------------------------------------
    } else if (commitOpen) {
      item.stage = 'voting_commit'
      let { commitEndDate } = await registry.getChallengePoll(item.listingHash)
      item.stageEndsTimestamp = commitEndDate
      item.stageEnds = moment.unix(commitEndDate).format('YYYY-MM-DD HH:mm:ss')
      item.label = <span><i className='icon signup' />Vote - Commit</span>
      item.color = 'blue'
      item.actionLabel = 'VOTE'
      item.stageMapSrc = 'MapCommit'

      // -----------------------------------------
      // -----------------------------------------
    } else if (revealOpen) {
      item.stageMapSrc = 'MapReveal'
      let { revealEndDate, votesFor, votesAgainst } = await registry.getChallengePoll(item.listingHash)
      item.stage = 'voting_reveal'
      item.stageEndsTimestamp = revealEndDate
      item.stageEnds = moment.unix(revealEndDate).format('YYYY-MM-DD HH:mm:ss')
      item.stats = { votesFor, votesAgainst }
      item.label = <span><i className='icon eye' />Vote - Reveal</span>
      item.color = 'green'
      item.actionLabel = 'REVEAL'

      // -----------------------------------------
      // -----------------------------------------
    } else if (applicationExists) {
      item.actionLabel = 'REFRESH'
      item.color = 'greyblack'
      item.stageMapSrc = 'MapRevealPending'
      item.label = <span><i className='icon circle thin' />Reveal - Pending</span>
      item.stage = 'reveal_pending'

      // -----------------------------------------
      // -----------------------------------------
    } else {
      item.stage = 'rejected'
      item.actionLabel = 'APPLY'
      item.color = 'blue'
      item.label = <span><i className='icon x circle' />Rejected</span>
      item.stageMapSrc = 'MapRejected'
    }

    return item

    // --------------------------------------------------------------
    // -------------Catch All - Wrong Network------------------------
    // --------------------------------------------------------------
  } catch (error) {
    console.log(error)
    if (item.domain) {
      return {
        domain: item.domain || '',
        siteName: item.domain || '',
        stage: 'wrong network',
        stageEndsTimestamp: '',
        stageEnds: '',
        action: 'wrong network',
        stats: 'wrong network',
        actionLabel: '',
        color: ''
      }
    } else {
      return {}
    }
  }
}

export default getDomainState

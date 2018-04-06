import React from 'react'
import registry from '../services/registry'
import moment from 'moment'

function isExpired (end) {
  const now = moment().unix()
  if (!end) return false
  return end < now
}

const getDomainState = async (domain) => {
  if (!domain) return {}
  const item = {
    domain,
    color: '',
    stage: null,
    stats: null,
    label: null,
    action: null,
    siteName: domain,
    stageEnds: null,
    challenged: null,
    actionLabel: null,
    stageMapSrc: null,
    stageEndsTimestamp: null
  }

  try {
    const listing = await registry.getListing(domain)
    const { applicationExpiry, isWhitelisted, challengeId } = listing
    const applicationExists = !!applicationExpiry
    const challengeOpen = (challengeId === 0 && !isWhitelisted && applicationExpiry)
    const commitOpen = await registry.commitStageActive(domain)
    const revealOpen = await registry.revealStageActive(domain)
    const isInRegistry = (isWhitelisted)
    item.challenged = challengeId > 0

// -----------------------------------------------------------
// -------------------In Registry States----------------------
// -----------------------------------------------------------
    if (isInRegistry || (commitOpen && isWhitelisted) || (revealOpen && isWhitelisted)) {
      if (challengeId) {
        // This is logic to determine the following state:
        // Applied --> In Registry --> Challenged --> Vote/Reveal End --> UPDATE STATUS
        // Checks to see if challenge is resolved by challenge ID

        const challenge = await registry.getChallenge(challengeId)

        if (commitOpen) {
          let {commitEndDate} = await registry.getChallengePoll(domain)
          item.stage = 'in_registry_in_commit'
          item.stageEndsTimestamp = commitEndDate
          item.stageEnds = moment.unix(commitEndDate).format('YYYY-MM-DD HH:mm:ss')
          item.color = 'blue'
          item.actionLabel = 'VOTE'
          item.label = <span><i className='icon check circle' /> <strong>|&nbsp;</strong> Voting - Commit</span>
          item.stageMapSrc = 'MapInRegistryCommit'
        } else if (revealOpen) {
          let { revealEndDate, votesFor, votesAgainst } = await registry.getChallengePoll(domain)
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
          item.actionLabel = 'REFRESH STATUS'
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
        item.actionLabel = 'REFRESH STATUS'
        item.color = 'greyblack'
        item.stageMapSrc = 'MapInApplicationPending'
        item.label = 'Application (Pending)'
        item.stage = 'in_application_pending'
      } else {
        item.label = 'In Application'
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
      let {commitEndDate} = await registry.getChallengePoll(domain)
      item.stageEndsTimestamp = commitEndDate
      item.stageEnds = moment.unix(commitEndDate).format('YYYY-MM-DD HH:mm:ss')
      item.label = 'Vote - Commit'
      item.color = 'blue'
      item.actionLabel = 'VOTE'
      item.stageMapSrc = 'MapVoting'

// -----------------------------------------
// -----------------------------------------
    } else if (revealOpen) {
      item.stageMapSrc = 'MapReveal'
      let { revealEndDate, votesFor, votesAgainst } = await registry.getChallengePoll(domain)
      item.stage = 'voting_reveal'
      item.stageEndsTimestamp = revealEndDate
      item.stageEnds = moment.unix(revealEndDate).format('YYYY-MM-DD HH:mm:ss')
      item.stats = { votesFor, votesAgainst }
      item.label = 'Vote - Reveal'
      item.color = 'green'
      item.actionLabel = 'REVEAL'

// -----------------------------------------
// -----------------------------------------
    } else if (applicationExists) {
      item.actionLabel = 'REFRESH STATUS'
      item.color = 'greyblack'
      item.stageMapSrc = 'MapRevealPending'
      item.label = 'Reveal - Pending'
      item.stage = 'reveal_pending'

// -----------------------------------------
// -----------------------------------------
    } else {
      item.stage = 'apply'
      item.actionLabel = 'APPLY'
      item.color = 'blue'
      item.label = <span><i className='icon x circle' /> Rejected</span>
      item.stageMapSrc = 'MapRejected'
    }
    return item

// --------------------------------------------------------------
// -------------Catch All Wrong Network--------------------------
// --------------------------------------------------------------
  } catch (error) {
    console.log(error)
    if (item.domain) {
      return {
        domain: item.domain || '',
        siteName: domain || '',
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

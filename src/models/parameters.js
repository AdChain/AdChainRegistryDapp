/*
 * Model for each of the parameters in parameterizer
 * - separated by core and governance
 * - properties: metric, name, value
*/

export const parameterData = {

  // CORE PARAM DATA
  coreParameterData: {
    minDeposit: {
      metric: 'ADT',
      name: 'minDeposit',
      normalizedName: 'Minimum Deposit',
      value: 0,
      info: 'The minimum amount of adToken required to apply a domain to the adChain Registry.'
    },
    applyStageLen: {
      metric: 'min',
      name: 'applyStageLength',
      normalizedName: 'Application Stage',
      value: 0,
      info: 'The length of time that a Domain Application is elligible to be challenged.'
    },
    commitStageLen: {
      metric: 'min',
      name: 'commitStageLength',
      normalizedName: 'Commit Stage',
      value: 0,
      info: 'The length of time the Voting Commit stage for a particular domain will last.'
    },
    revealStageLen: {
      metric: 'min',
      name: 'revealStageLength',
      normalizedName: 'Reveal Stage',
      value: 0,
      info: 'The length of time the Voting Reveal stage for a particular domain will last.'
    },
    dispensationPct: {
      metric: '%',
      name: 'dispensationPct',
      normalizedName: 'Dispensation Pct',
      value: 0,
      info: 'The percentage of adToken awarded to either the Applicant or the Challenger once the Voting Reveal Stage ends.'
    },
    voteQuorum: {
      metric: '%',
      name: 'voteQuorum',
      normalizedName: 'Vote Quorum',
      value: 0,
      info: 'The percentage of the total votes needed for the Supporting side to be declared as the winner. For example, if VoteQuorum is set to 67%, then the Supporting Side (the side voting for the Applicant) will need to obtain at least 67% of the total votes to win.'
    }
  },
  // GLOBAL PARAM DATA
  governanceParameterData: {
    pMinDeposit: {
      metric: 'ADT',
      name: 'gMinDeposit',
      normalizedName: 'Gov. Min Deposit',
      value: 0,
      info: 'The minimum amount of adToken required to create a Proposal to modify either Core or Governance Parameter Values in this Governance Module.'
    },
    pApplyStageLen: {
      metric: 'min',
      name: 'gApplyStageLength',
      normalizedName: 'Gov. Application Stage',
      value: 0,
      info: 'The length of time that a Proposal in the Governance Module is able to be Challenged before automatically going into effect.'
    },
    pCommitStageLen: {
      metric: 'min',
      name: 'gCommitStageLength',
      normalizedName: 'Gov. Commit Stage',
      value: 0,
      info: 'The length of time that a Proposal in the Governance Module is able to be Voted on before going into the Reveal Stage.'
    },
    pRevealStageLen: {
      metric: 'min',
      name: 'gRevealStageLength',
      normalizedName: 'Gov. Reveal Stage',
      value: 0,
      info: 'The length of time adToken holders have to Reveal previously commited votes for Proposals made in the Governance Module.'
    },
    pDispensationPct: {
      metric: '%',
      name: 'gDispensationPct',
      normalizedName: 'Gov. Dispensation Pct',
      value: 0,
      info: 'The percentage of adToken awarded to either the Applicant or the Challenger once revealStageLength has ended.'
    },
    pVoteQuorum: {
      metric: '%',
      name: 'gVoteQuorum',
      normalizedName: 'Gov. Vote Quorum',
      value: 0,
      info: 'The percentage of votes needed to win by the Supporting side of a new Proposal. For example, if voteQuorum is set to 67%, then the Supporting side (the side voting for the Applicant) will need to obtain at least 67% of the total votes to win. '
    }
  }
}

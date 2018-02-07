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
      value: 0
    },
    applyStageLen: {
      metric: 'min',
      name: 'applyStageLength',
      value: 0
    },
    commitStageLen: {
      metric: 'min',
      name: 'commitStageLength',
      value: 0
    },
    revealStageLen: {
      metric: 'min',
      name: 'revealStageLength',
      value: 0
    },
    dispensationPct: {
      metric: '%',
      name: 'dispensationPct',
      value: 0
    },
    voteQuorum: {
      metric: '%',
      name: 'voteQuorum',
      value: 0
    }
  },
  // GLOBAL PARAM DATA
  governanceParameterData: {
    pMinDeposit: {
      metric: 'ADT',
      name: 'gMinDeposit',
      value: 0
    },
    pApplyStageLen: {
      metric: 'min',
      name: 'gApplyStageLength',
      value: 0
    },
    pCommitStageLen: {
      metric: 'min',
      name: 'gCommitStageLength'
    },
    pRevealStageLen: {
      metric: 'min',
      name: 'gRevealStageLength',
      value: 0
    },
    pDispensationPct: {
      metric: '%',
      name: 'gDispensationPct',
      value: 0
    },
    pVoteQuorum: {
      metric: '%',
      name: 'gVoteQuorum',
      value: 0
    }
  }
}

// These arrays contain the different steps for each walkthrough in the Registry Guide

export const ApplicationSteps = [
  {
    title: 'Step 1',
    text: '<span>Applying a Domain</span>Enter the domain you wish to apply. Make sure to use the domain.com format (no www.)',
    selector: '.JoyrideForm',
    position: 'right',
    type: 'click',
    isFixed: true,
    name: 'application-first-step',
    parent: 'SideBarApplicationContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 2',
    text: '<span>Applying a Domain</span>Enter the amount of adToken you wish to stake with your application',
    selector: '.ApplicationContainer',
    position: 'right',
    type: 'click',
    isFixed: true,
    name: 'application-second-step',
    parent: 'SideBarApplicationContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 3',
    text: '<span>Applying a Domain</span>With MetaMask unlocked, you\'ll be able to see your ETH and ADT balance here. Both ADT and ETH are needed to apply a Domain.',
    selector: '.menu.right',
    position: 'bottom',
    type: 'click',
    isFixed: true,
    name: 'application-third-step',
    parent: 'MainTopBar',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 4',
    text: '<span>Applying a Domain</span>With all of the fields filled out, and enough ETH to cover the transaction, you will have successfully applied a domain.',
    selector: '.ApplicationContainer',
    position: 'right',
    type: 'click',
    isFixed: true,
    name: 'application-fourth-step',
    parent: 'SideBarApplicationContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 5',
    text: '<span>Applying a Domain</span>Once the transactions are signed, your applied domain can be found in the DOMAINS box.',
    selector: '.RegistryGuideStaticDomainsTable',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'application-fifth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 6',
    text: '<span>Applying a Domain</span>Within your Dashboard, you can also track your domain\'s application into the adChain Registry',
    selector: '.RegistryGuideStaticDashboard',
    position: 'right',
    type: 'click',
    isFixed: true,
    name: 'application-sixth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  }
]

export const ChallengeSteps = [
  {
    title: 'Step 1',
    text: '<span>Challenging a Domain</span>You can use the DOMAIN FILTERS box to search for individual domains you want to Challenge. Domains are only eligible to be Challenged during the "In Application" or "In Registry" stages.',
    selector: '.DomainsFilterPanel',
    position: 'right',
    type: 'click',
    isFixed: true,
    name: 'challenge-first-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 2',
    text: '<span>Challenging a Domain</span>Click on the domain you want to Challenge to open the Domain-Level View.',
    selector: '.RegistryGuideStaticDomainsTable',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'challenge-second-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 3',
    text: '<span>Challenging a Domain</span>Clicking on the "CHALLENGE" button challenges the domain\'s application by staking the minDeposit amount from your wallet. This will move the domain\'s application into the Voting Commit stage.',
    selector: '.RegistryGuideStaticChallenge',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'challenge-third-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 4',
    text: '<span>Challenging a Domain</span>Now that you\'ve challenged the domain, you have moved the domain\'s stage from either In Application or In Registry, to Voting.',
    selector: '.RegistryGuideStaticVoting',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'challenge-fourth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  }
]

export const CommitSteps = [
  {
    title: 'Step 1',
    text: '<span>Committing a Vote</span>You can use the DOMAIN FILTERS box to filter the domains that are in the Voting Commit stage.',
    selector: '.DomainsFilterPanel',
    position: 'right',
    type: 'click',
    isFixed: true,
    name: 'vote-first-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 2',
    text: '<span>Committing a Vote</span>The filtered domains are all in the Voting Commit stage. Voters have until the Stage Ends period to commit votes.',
    selector: '.RegistryGuideStaticDomainsTable',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'vote-second-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 3',
    text: '<span>Committing a Vote</span>To commit votes for a domain, simply enter the number of ADT you wish to commit to either SUPPORT or OPPOSE the domain\'s In Registry status.',
    selector: '.RegistryGuideStaticVoting',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'vote-third-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 4',
    text: '<span>Committing a Vote</span>Choose whether you will SUPPORT or OPPOSE the domain\'s application into the adChain Registry.',
    selector: '.RegistryGuideStaticVoting .WalkthroughStep4',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'vote-fourth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 5',
    text: '<span>Committing a Vote</span>Always remember to download your JSON commit file. It is needed to reveal your vote in the Reveal stage.',
    selector: '.RegistryGuideStaticVoting .LeftSegment',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'vote-fifth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 6',
    text: '<span>Committing a Vote</span>Once you have completed steps 1 through 3, you can vote by clicking on "SUBMIT VOTE".',
    selector: '.RegistryGuideStaticVoting .SubmitVoteButton',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'vote-sixth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  }
]

export const RevealSteps = [
  {
    title: 'Step 1',
    text: '<span>Revealing a Vote</span>You can use the DOMAIN FILTERS box to filter the domains that are in the Voting Reveal stage.',
    selector: '.DomainsFilterPanel',
    position: 'right',
    type: 'click',
    isFixed: true,
    name: 'reveal-first-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 2',
    text: '<span>Revealing a Vote</span>The filtered domains are all in the Voting Reveal stage. Voters have until the Stage Ends period to reveal their votes.',
    selector: '.RegistryGuideStaticDomainsTable',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'reveal-second-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 3',
    text: '<span>Revealing a Vote</span>Revealed votes are outlined here. If you choose not to reveal your votes, then it will not be counted.',
    selector: '.RegistryGuideStaticReveal',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'reveal-third-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 4',
    text: '<span>Revealing a Vote</span>To reveal your previously committed vote, you can either: (1) upload the downloaded Commit JSON file or (2) enter the Secret Phrase, Challenge ID, and your vote option. Once you\'ve done either, press "REVEAL VOTE" and sign the MetaMask transaction.',
    selector: '.RegistryGuideStaticReveal .LeftSegment',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'reveal-fourth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  }
]

export const DomainJourneySteps = [
  {
    title: 'Step 1',
    text: '<span>Domain\'s Journey</span>When a domain is applied into the adChain Registry, it is immediately in the In Application stage.',
    selector: '.RegistryGuideModalDomainJourney .MapApplication',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-first-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 2',
    text: '<span>Domain\'s Journey</span>If the domain is not challenged during the In Application stage, it is automatically admitted into the adChain Registry.',
    selector: '.RegistryGuideModalDomainJourney .MapRegistryNoChallenge',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-second-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 3',
    text: '<span>Domain\'s Journey</span>If the domain is challenged during the In Application stage, it goes into the first voting stage: Voting Commit. ADT holders commit their votes to either Support or Oppose the domain\'s application.',
    selector: '.RegistryGuideModalDomainJourney .MapVoting',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-third-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 4',
    text: '<span>Domain\'s Journey</span>Once the Voting Commit stage ends, the Voting Reveal stage begins. In this stage, ADT holders who previously committed votes are asked to reveal them. Only revealed votes count.',
    selector: '.RegistryGuideModalDomainJourney .MapReveal',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-fourth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 5',
    text: '<span>Domain\'s Journey</span>If the majority of the revealed ADT votes are in-favor of the domain\'s application, then the domain is admitted into the adChain Registry.',
    selector: '.RegistryGuideModalDomainJourney .MapRegistryChallenge',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-fifth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 6',
    text: '<span>Domain\'s Journey</span>If the majority of the revealed ADT votes are in-opposition of the domain\'s application, then the domain is rejected from the adChain Registry. It can immediately be applied again.',
    selector: '.RegistryGuideModalDomainJourney .MapRejected',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'domainsjourney-sixth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  }
]

export const GovernanceSteps = [
  {
    title: 'Step 1',
    text: '<span>Governance</span>The CORE PARAMETERS set all key values for the adChain Registry.',
    selector: '.RegistryGuideCoreParameters',
    position: 'right',
    type: 'click',
    isFixed: true,
    name: 'governance-first-step',
    parent: 'GovernanceContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 2',
    text: '<span>Governance</span>GOVERNANCE PARAMETERS set the values for all PROPOSALS in the Governance Module.',
    selector: '.RegistryGuideGovernanceParameters',
    position: 'right',
    type: 'click',
    isFixed: true,
    name: 'governance-second-step',
    parent: 'GovernanceContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 3',
    text: '<span>Governance</span>The CREATE PROPOSALS box allows you to propose new values for both Core Parameters and Governance Parameters. If not challenged, the newly proposed parameter values are enacted.',
    selector: '.RegistryGuideCreateProposal',
    position: 'bottom',
    type: 'click',
    isFixed: true,
    name: 'governance-third-step',
    parent: 'GovernanceContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 4',
    text: '<span>Governance</span>The OPEN PROPOSALS box demonstrates all of the proposed parameter values for both CORE PARAMETERS and GOVERNANCE PARAMETERS. If an open proposal goes through the gApplyStageLength without being challenged, it is immediately implemented as a new parameter value.',
    selector: '.RegistryGuideOpenProposals',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'governance-fourth-step',
    parent: 'GovernanceContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Step 5',
    text: '<span>Governance</span>The CLAIM REWARDS box houses all voting rewards after the completion of a parameter proposal. If you voted for a proposal and your side won, your ADT reward can be claimed here.',
    selector: '.RegistryGuideClaimRewards',
    position: 'right',
    type: 'click',
    isFixed: true,
    name: 'governance-fifth-step',
    parent: 'GovernanceContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      footer: {
        display: 'block'
      }
    }
  }
]

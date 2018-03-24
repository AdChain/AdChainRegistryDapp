// These arrays contain the different steps for each walkthrough in the Registry Guide

export const ApplicationSteps = [
  {
    title: 'Application - First Step',
    text: 'Enter the domain you wish to apply. Make sure to use the domain.com format (no www.)',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Application - Second Step',
    text: 'Enter the amount of adToken you wish to stake with your application',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Application - Third Step',
    text: 'With MetaMask unlocked, you\'ll be able to see your ETH and ADT balance here. Both ADT and ETH are needed to apply a Domain.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Application - Fourth Step',
    text: 'With all of the fields filled out, and enough ETH to cover the transaction, you will have successfully applied a domain.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Application - Fifth Step',
    text: 'Once the transactions are signed, your applied domain can be found in the DOMAINS box.',
    selector: '.DomainsTable',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'application-fifth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Application - Sixth Step',
    text: 'Within your Dashboard, you can also track your domain\'s application into the adChain Registry',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  }
]

export const ChallengeSteps = [
  {
    title: 'Challenge - First Step',
    text: 'You can use the DOMAIN FILTERS box to search for individual domains you want to Challenge. Domains are only eligible to be Challenged during the "In Application" or "In Registry" stages.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Challenge - Second Step',
    text: 'Click on the domain you want to Challenge to open the Domain-Level View.',
    selector: '.DomainsTable',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'challenge-second-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Challenge - Third Step',
    text: 'Clicking on the "CHALLENGE" button challenges the domain\'s application by staking the minDeposit amount from your wallet. This will move the domain\'s application into the Voting Commit stage.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Challenge - Fourth Step',
    text: 'Not only can you challenge domains In Application, but you can also challenge domains that are already in the adChain Registry.',
    selector: '.RegistryGuideStaticInRegistry',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'challenge-fourth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Challenge - Fifth Step',
    text: 'Simply click on "CHALLENGE" and initiate the voting stage. Domains In Registry that are challenged continue to be in the registry until the voting stage ends and the majority of ADT holders vote to remove the domain.',
    selector: '.RegistryGuideStaticInRegistry .ChallengeButton',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'challenge-fifth-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  }
]

export const CommitSteps = [
  {
    title: 'Vote - First Step',
    text: 'You can use the DOMAIN FILTERS box to filter the domains that are in the Voting Commit stage.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Vote - Second Step',
    text: 'The filtered domains are all in the Voting Commit stage. Voters have until the Stage Ends period to commit votes.',
    selector: '.DomainsTable',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'vote-second-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Vote - Third Step',
    text: 'To commit votes for a domain, simply enter the number of ADT you wish to commit to either SUPPORT or OPPOSE the domain\'s In Registry status.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Vote - Fourth Step',
    text: 'Choose whether you will SUPPORT or OPPOSE the domain\'s application into the adChain Registry.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Vote - Fifth Step',
    text: 'Always remember to download your JSON commit file. It is needed to reveal your vote in the Reveal stage.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Vote - Sixth Step',
    text: 'Once you have completed steps 1 through 3, you can vote by clicking on "SUBMIT VOTE".',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  }
]

export const RevealSteps = [
  {
    title: 'Reveal - First Step',
    text: 'You can use the DOMAIN FILTERS box to filter the domains that are in the Voting Reveal stage.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Reveal - Second Step',
    text: 'The filtered domains are all in the Voting Reveal stage. Voters have until the Stage Ends period to reveal their votes.',
    selector: '.DomainsTable',
    position: 'left',
    type: 'click',
    isFixed: true,
    name: 'reveal-second-step',
    parent: 'DomainsContainer',
    style: {
      backgroundColor: '#3434CE',
      textAlign: 'left',
      width: '29rem',
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Reveal - Third Step',
    text: 'Revealed votes are outlined here. If you choose not to reveal your votes, then it will not be counted.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Reveal - Fourth Step',
    text: 'To reveal your previously committed vote, you can either: (1) upload the downloaded Commit JSON file or (2) enter the Secret Phrase, Challenge ID, and your vote option. Once you\'ve done either, press "REVEAL VOTE" and sign the MetaMask transaction.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  }
]

export const DomainJourneySteps = [
  {
    title: 'Domain\'s Journey - First Step',
    text: 'When a domain is applied into the adChain Registry, it is immediately in the In Application stage.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Domain\'s Journey - Second Step',
    text: 'If the domain is not challenged during the In Application stage, it is automatically admitted into the adChain Registry.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Domain\'s Journey - Third Step',
    text: 'If the domain is challenged during the In Application stage, it goes into the first voting stage: Voting Commit. ADT holders commit their votes to either Support or Oppose the domain\'s application.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Domain\'s Journey - Fourth Step',
    text: 'Once the Voting Commit stage ends, the Voting Reveal stage begins. In this stage, ADT holders who previously committed votes are asked to reveal them. Only revealed votes count.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Domain\'s Journey - Fifth Step',
    text: 'If the majority of the revealed ADT votes are in-favor of the domain\'s application, then the domain is admitted into the adChain Registry.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Domain\'s Journey - Sixth Step',
    text: 'If the majority of the revealed ADT votes are in-opposition of the domain\'s application, then the domain is rejected from the adChain Registry. It can immediately be applied again.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  }
]

export const GovernanceSteps = [
  {
    title: 'Governance - First Step',
    text: 'The CORE PARAMETERS set all key values for the adChain Registry.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      },
      close: {
        color: '#FFF'
      }
    }
  },
  {
    title: 'Governance - Second Step',
    text: 'GOVERNANCE PARAMETERS set the values for all PROPOSALS in the Governance Module.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Governance - Third Step',
    text: 'The CREATE PROPOSALS box allows you to propose new values for both Core Parameters and Governance Parameters. If not challenged, the newly proposed parameter values are enacted.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Governance - Fourth Step',
    text: 'The OPEN PROPOSALS box demonstrates all of the proposed parameter values for both CORE PARAMETERS and GOVERNANCE PARAMETERS. If an open proposal goes through the gApplyStageLength without being challenged, it is immediately implemented as a new parameter value.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      }
    }
  },
  {
    title: 'Governance - Fifth Step',
    text: 'The CLAIM REWARDS box houses all voting rewards after the completion of a parameter proposal. If you voted for a proposal and your side won, your ADT reward can be claimed here.',
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
      main: {
        padding: '20px'
      },
      footer: {
        display: 'block'
      }
    }
  }
]

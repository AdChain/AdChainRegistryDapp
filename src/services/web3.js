import store from '../store'

const ONE_SECOND = 1000
const ONE_MINUTE = ONE_SECOND * 60

class Web3Service {
  constructor () {
    this.accounts = []
    this.accountsError = null
    this.selectedAccount = null
    this.network = null
    this.networkId = null
    this.networkError = null

    const accounts = this.getAccounts()

    this.interval = null
    this.networkInterval = null
    this.fetchAccounts = this.fetchAccounts.bind(this)
    this.fetchNetwork = this.fetchNetwork.bind(this)

    if (accounts) {
      this.handleAccounts(accounts, true)
    }

    /**
     * Start polling accounts, & network. We poll indefinitely so that we can
     * react to the user changing accounts or netowrks.
     */
    // this.initWeb3Poll()
    this.fetchAccounts()
    this.fetchNetwork()
    this.initPoll()
    this.initNetworkPoll()
  }

  /**
   * Init web3 object polling
   * @return {void}
   */
  initWeb3Poll () {
    this.web3 = window.web3

    if (this.web3) {
      window.clearTimeout(this.web3PollTimeout)
    } else {
      this.web3PollTimeout = setTimeout(() => {
        this.initWeb3Poll()
      }, ONE_SECOND)
    }
  }

  /**
   * Init web3/account polling, and prevent duplicate interval.
   * @return {void}
   */
  initPoll () {
    if (!this.interval) {
      this.interval = setInterval(this.fetchAccounts, ONE_SECOND)
    }
  }

  /**
   * Init network polling, and prevent duplicate intervals.
   * @return {void}
   */
  initNetworkPoll () {
    if (!this.networkInterval) {
      this.networkInterval = setInterval(this.fetchNetwork, ONE_MINUTE)
    }
  }

  /**
   * Update state regarding the availability of web3 and an ETH account.
   * @return {void}
   */
  fetchAccounts () {
    const { web3 } = window
    const ethAccounts = this.getAccounts()

    if (!(ethAccounts && ethAccounts.length)) {
      web3 && web3.eth && web3.eth.getAccounts((err, accounts) => {
        if (err) {
          this.accountsError = err

          store.dispatch({
            type: 'WEB3_FETCH_ACCOUNT_ERROR',
            error: err
          })
        }
      })
    } else {
      this.handleAccounts(ethAccounts)
    }
  }

  handleAccounts (accounts, isConstructor = false) {
    let next = accounts[0]
    let curr = this.accounts[0]
    next = next && next.toLowerCase()
    curr = curr && curr.toLowerCase()
    const didChange = curr && next && (curr !== next)

    if (!isConstructor) {
      this.accountsError = null
      this.accounts = accounts
    }

    const didDefine = !curr && next

    if (didDefine || (isConstructor && next)) {
      store.dispatch({
        type: 'WEB3_RECEIVE_ACCOUNT',
        address: next
      })
    } else if (didChange) {
      store.dispatch({
        type: 'WEB3_CHANGE_ACCOUNT',
        address: next
      })

      window.location.reload()
    }
  }

  /**
   * Get the network and update state accordingly.
   * @return {void}
   */
  fetchNetwork () {
    const { web3 } = window

    web3 && web3.version && web3.version.getNetwork((err, netId) => {
      if (err) {
        this.networkError = err

        store.dispatch({
          type: 'WEB3_FETCH_NETWORK_ERROR',
          error: err
        })
      } else {
        this.networkError = null
        this.networkId = netId

        // TODO check if it changed
        store.dispatch({
          type: 'WEB3_CHANGE_NETWORK',
          networkId: netId
        })
      }
    })
  }

  /**
   * Get the account. We wrap in try/catch because reading `web3.eth.accounrs`
   * will throw if no account is selected.
   * @return {String}
   */
  getAccounts () {
    try {
      const { web3 } = window
      // throws if no account selected
      const accounts = web3.eth.accounts

      return accounts
    } catch (e) {
      return []
    }
  }
}

/*
function getNetwork(networkId) {
  switch (networkId) {
    case '1':
      return 'MAINNET'
    case '2':
      return 'MORDEN'
    case '3':
      return 'ROPSTEN'
    default:
      return 'UNKNOWN'
  }
}
*/

export default new Web3Service()

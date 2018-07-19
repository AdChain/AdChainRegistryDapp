
class TransactionQueue {
  constructor () {
    this.exists = !!window.localStorage.getItem('registryQueue')
    this.queue = JSON.parse(this.exists) || []
    this.current = window.localStorage.getItem('current')
    this.network = window.localStorage.getItem('currentNetwork')
    this.queueName = window.localStorage.getItem('registryQueue')
    this.currentTxHash = window.localStorage.getItem('currentTxHash')
    this.currentAccount = window.localStorage.getItem('currentAccount')
    this.currentTxStatus = window.localStorage.getItem('currentTxStatus')
    this.init()
  }

  init () {
    this.checkToSeeIfQueueShouldBeCleared()
    this.currentTxStatus = this.getTransactionStatus()
    if (this.queue.length > 0) {

    }
  }

  checkToSeeIfQueueShouldBeCleared () {
        // If transaction queue is at last node
        // and last transaction is no longer pending
        // clear the queue in local storage
  }

  doesExist (account, network) {
    try {
      const currentNetwork = JSON.parse(this.network)
            // console.log("network:", JSON.parse(this.network), "exists: ", this.exists, "network: ", currentNetwork.type)
      if (currentNetwork.hasOwnProperty('type')) {
        if (this.exists && account === this.currentAccount && network.type === currentNetwork.type) {
          console.log('Queue exists')
          return true
        }
      }
    } catch (error) {
      this.clearQueue()
      return false
    }
  }

  create ({ name, account, network }) {
    console.log('create new queue')
    this.setQueueName(name)
    this.setAccount(account)
    this.setNetwork(network)
    return this.queue
  }

  addNode (txData) {
    this.queue = txData.map(node => node)
    window.localStorage.setItem(`${this.queueName}Queue`, JSON.stringify(this.queue))
    this.logQueue()
  }

  logQueue () {
    let q = window.localStorage.getItem(`${this.queueName}Queue`)
    console.log('Queue: ', JSON.parse(q))
  }

  setQueueName (name) {
    this.queueName = name
  }

  setAccount (account) {
    this.currentAccount = account
    window.localStorage.setItem('currentAccount', account)
  }

  setNetwork (network) {
    this.network = network
    window.localStorage.setItem('currentNetwork', JSON.stringify(network))
  }

  validateTxFnObject ({ order, fnName, status, params }) {
    if (!order || !fnName || !status || !params) {
      console.error('Required param value missing')
      return {}
    }
    return {
      order,
      fnName,
      status,
      params
    }
  }
  getQueue () {
    return this.queue
  }
  getQueueLength () {
    return this.queue.length
  }
  setCurrent (current) {
    this.current = current
    window.localStorage.setItem('current', this.current)
  }

  setCurrentTxHash () {
    const currentTxHash = window.localStorage.getItem('currentTxHash')
    if (currentTxHash) {
      this.currentTxHash = currentTxHash
    }
  }

  updateCurrentTxHash (hash) {
    this.currentTxHash = hash
    window.localStorage.setItem('currentTxHash', this.currentTxHash)
  }

  async getTransactionStatus () {
    const etherscanAPIKey = 'XAINI9CDZE14E77MGPR31IKE1SV54UXH83'
    let res = null
    try {
      res = await (
                await window.fetch(`https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${this.currentTxHash}&apikey=${etherscanAPIKey}`)).json()
    } catch (error) {
      console.log(error)
    }
    return res
  }

  removeNode (num) {
    console.log('1: ', this.queue, num)
    this.queue = this.queue.splice(num, this.queue.length)
    console.log('2: ', this.queue)
    window.localStorage.setItem('registryQueue', this.queue)
    console.log('Remove Node')
  }

  clearQueue () {
    this.queue = []
    window.localStorage.removeItem('registryQueue')
    window.localStorage.removeItem('current')
    window.localStorage.removeItem('currentTxHash')
    window.localStorage.removeItem('currentAccount')
    window.localStorage.removeItem('currentNetwork')
    window.localStorage.removeItem('currentTxStatus')
  }
}

export default new TransactionQueue()

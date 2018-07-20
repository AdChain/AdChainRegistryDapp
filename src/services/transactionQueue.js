import registry from '../services/registry'

class TransactionQueue {
  constructor () {
    try {
      this.exists = window.localStorage.getItem('registryQueue')
      this.queue = JSON.parse(this.exists) || []
      this.current = window.localStorage.getItem('current')
      this.network = window.localStorage.getItem('currentNetwork')
      this.queueName = window.localStorage.getItem('registryQueue')
      this.currentTxHash = window.localStorage.getItem('currentTxHash')
      this.currentAccount = window.localStorage.getItem('currentAccount')
      this.currentTxStatus = window.localStorage.getItem('currentTxStatus')
      this.init()
    } catch (error) {
      console.log('error: ', error)
    }
  }

  async init () {
    await this.shouldQueueBeCleared()
    await this.setCurrentTxStatus()
  }

  shouldQueueBeCleared () {
        // If transaction queue is at last node
        // and last transaction is no longer pending
        // clear the queue in local storage
    if (this.queue.length < 1) {
      return true
    } else {
      return false
    }
  }

  async setCurrentTxStatus () {
    const checkPending = await setInterval(async () => {
      this.currentTxStatus = await this.getTransactionStatus()
      window.localStorage.setItem('currentTxStatus', this.currentTxStatus)
      if (this.shouldMoveToNextTx()) {
        clearInterval(checkPending)
        this.removeNode(1)
        this.executeNextInQueue()
      }
    }, 10000)
  }

  shouldMoveToNextTx () {
    if ((this.currentTxStatus === 'pass' || this.currentTxStatus === 'fail') && this.getQueueLength() > 0) {
      return true
    } else {
      if (this.getQueueLength() < 1) {
        console.log(`%c Current transaction still pending`, 'color:blue')
      } else {
        console.log(`%c Transaction ${this.currentTxStatus}`, 'color:blue')
      }
      return false
    }
  }

  doesExist (account, network) {
    try {
      const currentNetwork = JSON.parse(this.network)
            // console.log("network:", JSON.parse(this.network), "exists: ", this.exists, "network: ", currentNetwork.type)
      if (currentNetwork.hasOwnProperty('type')) {
        if (this.exists && account === this.currentAccount && network.type === currentNetwork.type) {
          console.log('\n Queue exists: ', this.queue, '\n \n', 'Queue Length: ', this.getQueueLength(), '\n \n', 'Current TX Hash: ', this.currentTxHash, '\n \n')
          console.log(`\n Current TX Status: %c ${this.currentTxStatus}`, `color:${this.currentTxStatus === 'pass' ? 'green' : 'red'}`, '\n \n')
          return true
        }
      }
    } catch (error) {
      console.log(error)
      this.clearQueue()
      return false
    }
  }

  create ({ name, account, network }) {
    console.log('Create New Queue')
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

  async executeNextInQueue () {
    try {
      console.log('Execute next in queue')
    //   const service = this.queue[0].service
      const serviceFn = this.queue[0].serviceFn
      const params = this.queue[0].params
      await registry[serviceFn](...params)
    } catch (error) {
      console.log(error)
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
                await window.fetch(`https://api-rinkeby.etherscan.io/api?module=transaction&action=getstatus&txhash=${this.currentTxHash}&apikey=${etherscanAPIKey}`)
            ).json()
      res = res.result.isError === '0' ? 'pass' : 'fail'
      return res
    } catch (error) {
      console.log(error)
    }
    return false
  }

  removeNode (num) {
    console.log('Remove Node')
    console.log('1: ', this.queue, num)
    this.queue = this.queue.splice(num, this.queue.length)
    console.log('2: ', this.queue)
    window.localStorage.setItem('registryQueue', JSON.stringify(this.queue))
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

class TransactionQueue {
  constructor () {
    this.exists = window.localStorage.getItem('queue')
    this.queue = JSON.parse(this.exists) || []
    this.current = 0
    this.currentTxHash = null
  }

  createTx ({ currentTx, currentTxHash, allTxData }) {
    return {
      numTxs: allTxData.length,
      currentTx,
      currentTxHash,
      allTxData: () => {
        return (
                    allTxData.map((x, i) => {
                      return {
                        [i + 1]: Object.assign({}, this.validateTxFnObject(x))
                      }
                    })
        )
      }
    }
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

  create () {
    const exists = window.localStorage.getItem('queue')
    if (exists) {
      this.queue = JSON.parse(exists)
      console.log('queue: ', this.queue)
    }
    return this.queue
  }

  incrementCurrent (current) {
    this.current += current
    window.localStorage.setItem('current', this.current)
  }

  updateCurrentTxhash (hash) {
    this.currentTxHash = hash
    window.localStorage.setItem('currentTxHash', this.currentTxHash)
  }

  async getTransactionStatus () {
    const etherscanAPIKey = 'XAINI9CDZE14E77MGPR31IKE1SV54UXH83'
    let res
    try {
      res = await (
                await window.fetch(`https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${this.currentTxHash}&apikey=${etherscanAPIKey}`)).json()
    } catch (error) {
      console.log(error)
    }
    return res
  }

  addNode (txData) {
    this.queue.push(this.createTx(txData))
    window.localStorage.setItem('queue', JSON.stringify(this.queue))
  }

  removeNode () {

  }

  clearQueue () {
    this.queue = []
    window.localStorage.setItem('queue', '')
  }
}

export default new TransactionQueue()

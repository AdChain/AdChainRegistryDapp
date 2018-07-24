import React, { Component } from 'react'
import './TransactionQueue.css'
import queue from '../../services/transactionQueue'
import { Modal } from 'semantic-ui-react'

class TransactionQueue extends Component {
    constructor() {
        super()
        this.state = {
            open: false,
            modal: null
        }
        this.closeModal = this.closeModal.bind(this)
        this.openModal = this.openModal.bind(this)
    }
    componentWillMount(){
        this.updateQueueLength()
    }

    render() {
        return (
            <div className="TransactionQueue">
                <button className='ui button blue'>{this.state.queueLength} txs</button>
                <br/><br/>
                <button className='ui button blue' onClick={() => { this.openModal() }}>1. Look at Queue</button>
                <br />
                <button className='ui button green' onClick={() => { queue.executeNextInQueue() }}>2. Execute Next</button>
                <br />
                <button className='ui button mini red' onClick={() => { queue.clearQueue() }}>Clear Queue</button>
                {this.state.modal}
            </div>
        )
    }

    openModal() {
        this.setState({
            open: true,
            modal: this.createQueueModal()
        })
    }

    updateQueueLength(){
        setInterval(()=>{
            this.setState({
                queueLength: queue.getQueueLength()
            })
        },1500)
    }

    closeModal() {
        this.setState({
            open: false,
            modal: this.createQueueModal()
        })
    }

    createQueueModal() {
        let q = JSON.parse(window.localStorage.getItem(`registryQueue`)) || []

        return (
            <Modal
                size={'small'}
                open={this.state.open}
                onClose={() => this.closeModal()}
                className='TransactionProgressModal'
                closeOnEscape={true}
                closeOnRootNodeClick={true}
                closeIcon={true}>
                <Modal.Header className='TransactionProgressHeader'>
                    Transaction Queue
                </Modal.Header>
                <Modal.Content>
                    <ol>
                        {
                            q.map((q, i) => {
                                return <li key={q.name + i}>{q.name}</li>
                            })
                        }
                    </ol>
                </Modal.Content>
                <button onClick={() => this.closeModal()}>Close</button>
            </Modal>
        )
    }
}

export default TransactionQueue
import React, { Component } from 'react'
import { Button, Header, Modal, Icon } from 'semantic-ui-react'

class InDevelopmentAlert extends Component {
  constructor () {
    super()
    this.state = {
      open: true
    }
  }

  close () {
    this.setState({open: false})
  }
  render () {
    return (
      <Modal open={this.state.open}>
        <Header icon='configure' content='Under Development' />
        <Modal.Content >
          <p style={{padding: '20px', fontSize: '16px'}}>
        The adChain Registry is currently under development as we prepare to launch on the Main Ethereum Network.
        <br /><br /> This DApp will be intermittently functional until April/May.
        </p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' inverted onClick={this.close.bind(this)}>
            <Icon name='checkmark' /> OK
      </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default InDevelopmentAlert

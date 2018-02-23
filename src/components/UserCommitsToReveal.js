import React, { Component } from 'react'
import './UserCommitsToReveal.css'

class UserCommitsToReveal extends Component {
  constructor (props) {
    super()

    this.state = {
      commitsToReveal: props.commitsToReveal
    }
  }

  componentDidMount () {
    this._isMounted = true
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.commitsToReveal !== this.props.commitsToReveal) {
      this.setState({
        commitsToReveal: nextProps.commitsToReveal
      })
    }
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const { commitsToReveal } = this.state
    const data = commitsToReveal ? commitsToReveal.map((domain, idx) => <div key={idx}><span>{domain.domain}</span></div>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>YOUR COMMITS TO REVEAL</span>
        <div className='ui grid'>
          <div className='column sixteen wide'>
            <div>
              <span>Domain</span>
              <span className='StageTitle'>Action</span>
            </div>
            <div>
              {data}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserCommitsToReveal

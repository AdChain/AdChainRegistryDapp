import React, { Component } from 'react'
import './UserAppliedDomains.css'

class UserAppliedDomains extends Component {
  constructor (props) {
    super()

    this.state = {
      appliedDomains: props.appliedDomains
    }
  }

  componentDidMount () {
    this._isMounted = true
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.appliedDomains !== this.props.appliedDomains) {
      this.setState({
        appliedDomains: nextProps.appliedDomains
      })
    }
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const { appliedDomains } = this.state
    const data = appliedDomains ? appliedDomains.map((domain, idx) => <div key={idx}><span>{domain.domain}</span><span>{domain.stage}</span></div>) : null

    return (
      <div className='BoxFrame DashboardColumn'>
        <span className='BoxFrameLabel ui grid'>DOMAINS YOU APPLIED</span>
        <div className='ui grid DomainList'>
          <div className='column sixteen wide'>
            <div>
              <span className='DomainTitle'>Domain</span>
              <span className='StageTitle'>Stage</span>
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

export default UserAppliedDomains

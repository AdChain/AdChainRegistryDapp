import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './StatProgressBar.css'

class StatProgressBar extends Component {
  constructor (props) {
    super()

    this.state = {
      fills: props.fills,
      fill: props.fill,
      showFillLabels: props.showFillLabels,
      showLegend: props.showLegend,
      fillLabels: props.fillLabels
    }
  }

  componentWillReceiveProps (props) {
    this.setState({
      fills: props.fills,
      fill: props.fill,
      showFillLabels: props.showFillLabels,
      showLegend: props.showLegend,
      fillLabels: props.fillLabels
    })
  }

  render () {
    const {
      fills,
      fill,
      showFillLabels,
      showLegend,
      fillLabels
    } = this.state

    return (
      <div className='StatProgressBar'>
        <div className='StatBarContainer'>
          {fills
            ? [<div
              key={Math.random()}
              style={{width: fills[0] ? `${fills[0]}%` : 'auto'}}
              title={`${fills[0]}%`}
              className='StatBarFillContainer'>
              {showFillLabels ? `${fills[0]}%` : null}
            </div>,
              <div
                key={Math.random()}
                style={{width: fills[1] ? `${fills[1]}%` : 'auto'}}
                title={`${fills[1]}%`}
                className='StatBarFillContainer'>
                {showFillLabels ? `${fills[1]}%` : null}
              </div>]
          : <div
            style={{width: `${fill}%`}}
            className='StatBarFillContainer Round'>
            {showFillLabels ? `${fill}%` : null}
          </div>
          }
        </div>
        {showLegend
          ? <div className='StatBarLegend'>
            <label className='FillLabel'>
              {fillLabels[0]}
            </label>
            <label className='FillLabel'>
              {fillLabels[1]}
            </label>
          </div>
          : null}
      </div>
    )
  }
}

StatProgressBar.propTypes = {
  fills: PropTypes.array,
  fill: PropTypes.number,
  showFillLabels: PropTypes.bool,
  showLegend: PropTypes.bool,
  fillLabels: PropTypes.array
}

export default StatProgressBar

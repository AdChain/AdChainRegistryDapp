import React from 'react'
import infoIcon from './assets/info_gray.svg'
import { Popup } from 'semantic-ui-react'

/*
 * This is the tooltip that is used throughout the app
 * when you hover over the grey info icons
*/
const Tooltip = (props) => {
  return (
    <Popup className='Tooltip'
      trigger={<img alt='i' className={props.class || 'InfoIcon'} src={infoIcon} />}
      content={props.info} />
  )
}
export default Tooltip

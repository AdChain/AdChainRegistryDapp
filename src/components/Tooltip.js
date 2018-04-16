import React from 'react'
import infoIcon from './assets/info_gray.svg'
import whiteIcon from './assets/info_white.svg'
import { Popup } from 'semantic-ui-react'

/*
 * This is the tooltip that is used throughout the app
 * when you hover over the grey info icons
*/
const Tooltip = (props) => {
  return (
    <Popup className='Tooltip'
      trigger={<img alt='i' className={props.class || 'InfoIcon'} src={props.whiteVersion ? whiteIcon : infoIcon} />}
      content={props.info} />
  )
}
export default Tooltip

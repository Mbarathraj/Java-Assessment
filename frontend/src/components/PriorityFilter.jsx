import React from 'react'

const PriorityFilter = ({value,onChange}) => {
  return (
    <select className='prority-filter' value={value} onChange={(e)=> onChange(e.target.value)}>
        <option value="">All Priority</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
    </select>
  )
}

export default PriorityFilter
import React from 'react'

const PageSize = ({value,onChange}) => {
    
  return (
    <select className='page-size' value={value} onChange={(e)=> onChange(e.target.value)}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
    </select>
  )
}

export default PageSize
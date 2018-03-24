import React from 'react'

export const ResourceIcon = (namespace) => (
  <div key={namespace} className={'resource-icon ' + namespace.toLowerCase()}></div>
)

var ResourceSummaryComponent = (props) => {
  const id = 'resource-' + props.resource.id
  const amount = Math.floor(props.resource.amount)
  const title = props
    .resource
    .toString()
  const max = props.max

  return (
    <resource id={id} className='resource' title={title}>
      {ResourceIcon(props.resource.namespace)}
      <amount className='resource-amount'>{amount}</amount>
      <amount className='max-amount'>/
      {max}</amount>
    </resource>
  )
}

export default ResourceSummaryComponent

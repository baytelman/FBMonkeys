import React from 'react';

const ICON = {
  banana: '🍌',
  monkey: '🐵',
  wood: '🌲',
  rock: '🗻'
};

const ResourceIcon = ({ namespace, amount, maximum, edge = true }) => (
  <span
    key={namespace}
    style={{
      display: 'inline-block',
      marginBottom: 2,
      marginLeft: 0,
      marginRight: 1,
      padding: edge ? 2 : 0,
      border: edge ? '1px solid rgba(0,0,0,0.2)' : null,
      backgroundColor: 'white',
      borderRadius: 5
    }}>
    {ICON[namespace] || namespace}
    {Math.round(amount)}
    {maximum ? ' / ' + Math.round(maximum) : null}
  </span>
);
export default ResourceIcon;

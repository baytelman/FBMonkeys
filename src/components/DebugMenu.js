import React from 'react';

const DebugMenu = ({ save, load }) => (
  <div
    style={{
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 10,
      border: '2px solid rgba(0, 0, 0, .5)',
      background: 'rgba(255, 255, 255, .8)',
      borderRadius: 10
    }}>
    Debug
    <ul>
      <li>
        <button onClick={save}>Save</button>
      </li>
      <li>
        <button onClick={load}>Load</button>
      </li>
    </ul>
  </div>
);

export default DebugMenu;

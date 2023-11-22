import React from 'react';

function App(props: {
  icon: string,
  title: string,
  content: string,
}) {
  return (
    <div className="app-page-title">
      <div className="page-title-wrapper">
        <div className="page-title-heading">
          <div className="page-title-icon">
            <i className={`pe-7s-${props.icon} icon-gradient bg-premium-dark`} />
          </div>
          <div>
            {props.title}
            <div className="page-title-subheading">{props.content}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
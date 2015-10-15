import React, { Component, PropTypes } from 'react';

class App extends Component {
  render() {
    return !this.props.error ? (
      <div className="App">
        {this.props.children}
      </div>
    ) : this.props.children;
  }
}

export default App;

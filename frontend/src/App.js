// App.js
import React, { Component } from 'react';

class App extends Component {
  state = {
    items: []
  };
  async componentDidMount() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/'); // fetching the data from api, before the page loaded
      const items = await res.json();
      this.setState({items});
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div>
        <h1>Welcome to YummY</h1>
        {this.state.items.map(item => (
          <div key={item.id}>
            <h4>{item.title}</h4>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
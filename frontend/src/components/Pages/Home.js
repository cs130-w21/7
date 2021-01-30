import React from 'react'
import {Link} from 'react-router-dom';
class Home extends React.Component {
    render() {
        return (
          <div>
            <h1>Welcome to YummY</h1>
            <h3>This is Home Page</h3>
            <button><Link to={`/setting`}>Settings</Link></button>
          </div>
        );
      }
}

export default Home;
import React from 'react'

export default class Setting extends React.Component {
    
    state = {
        infos : []
    };
    
    componentDidMount() {
        fetch('http://127.0.0.1:8000/api/user/1') // fetching the data from api, before the page loaded
        .then(result => result.json())
        .then((data) => {
            this.setState({infos: [data]})
        })
        .catch(console.log)
    }
    
    render() {
        return (
        <div>
            <h1>Welcome to YummY</h1>
            <h3>This is Setting Page</h3>
            {this.state.infos.map(item => (
                <div key={item.id}>
                    <h3>Username: {item.username}</h3>
                    <h3>Full Name: {item.name}</h3>
                    <h3>Email: {item.email}</h3>
                    <h3>Age: {item.age}</h3>
                    <h3>Height: {item.height}</h3>
                    <h3>Weight: {item.weight}</h3>
                </div>
                ))}
             
        </div>
        );
      }
}
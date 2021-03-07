import React from 'react';
import '../../App.css';
import { Button } from '../Button';

class EventDetails extends React.Component {
  constructor(){
    super();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.event_id = urlParams.get('id');
    this.user_id = localStorage.getItem("id");
    this.token = localStorage.getItem("token");
    this.state = {
      name: "",
      datetime: "",
      location : "",
      description: "",
      host: "",
      attendees: [],
      inEvent: false
    };
  }
  handleLogout = () =>{
    localStorage.clear();
    window.location.href='/';
  }

  componentDidMount(){
    fetch('/api/event/get_event', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.token}`
        },
        body: JSON.stringify({
            'id': this.event_id
        }),
    }).then(response => response.json())
        .then(result => {
            console.log(result);
            if(result["message"]=="Token expired" || result["detail"]=="Invalid token." ){
                this.handleLogout();
            } 
            var host = "";
            var inEvent = false;
            var attendees = [];
            result.attendees.map(attendee => {
              if(result.host == attendee.id){
                host = attendee.username;
              } 
              attendees.push(attendee.username)
              if(this.user_id == attendee.id) {
                inEvent = true;
              }
            })
            var name = result.name;
            var m = new Date(result.datetime);
            var datetime = m.getUTCFullYear() + "/" +
                            ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
                            ("0" + m.getUTCDate()).slice(-2) + " " +
                            ("0" + m.getUTCHours()).slice(-2) + ":" +
                            ("0" + m.getUTCMinutes()).slice(-2) + ":" +
                            ("0" + m.getUTCSeconds()).slice(-2);

            var location = result.location;
            var description = result.description;
            this.setState({
                name: name,
                datetime: datetime,
                location: location,
                description, description,
                host:host,
                attendees:attendees,
                inEvent:inEvent
            })
        });
  }

  leaveEvent() {
    fetch('/api/event/leave_event', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.token}`
        },
        body: JSON.stringify({
            'event_id': this.event_id,
            'user_id': this.user_id
        }),
    }).then(response => response.json())
        .then(result => {
          if(result["message"]=="Token expired" || result["detail"]=="Invalid token." ){
            this.handleLogout();
          } 
          console.log(result)
          window.location.href='/event';
        });
  }

  joinEvent() {
    fetch('/api/event/join_event', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.token}`
        },
        body: JSON.stringify({
            'event_id': this.event_id,
            'user_id': this.user_id
        }),
    }).then(response => response.json())
        .then(result => {
          console.log(result)
          if(result["message"]=="Token expired" || result["detail"]=="Invalid token." ){
            this.handleLogout();
          } 
          window.location.href='/event';
        });
  }

  render(){
    if (this.state.name=="")
      return(<></>);
    return (
        <div className='cards'>
            <h2>Title : {this.state.name}</h2><br/>
            <h2>Date : {this.state.datetime}</h2><br/>
            <h2>Host : {this.state.host}</h2><br/>
            <h2>Location : {this.state.location}</h2><br/>
            <h2>Description : {this.state.description}</h2><br/>
            <h2>Attendees : {this.state.attendees.map(attendee => (
                                    attendee+" "
                                ))}</h2><br/>
            <Button id="createEvent" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={this.state.inEvent ? () => this.leaveEvent() : () => this.joinEvent()} >{this.state.inEvent ? "LEAVE THIS EVENT" : "JOIN THIS EVENT"}</Button>
        </div>
    );
  }
}

export default EventDetails;

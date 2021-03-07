import React from 'react';
import CardView from './CardView';
import '../Cards.css';
import { Button } from '../Button';
import EventView from './EventView';

class Event extends React.Component {
    constructor(){
        super();
        this.state = {
            myEvents: [],
            otherEvents: []
        };
        this.token = localStorage.getItem('token');
        this.loaded = false;
        console.log(this.token);
    }

    handleLogout = () =>{
        localStorage.clear();
        window.location.href='/';
    }

    componentDidMount(){
        fetch('/api/event/get_events', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.token}`
            },
            body: JSON.stringify({
                'name': ""
            }),
        }).then(response => response.json())
            .then(result => {
                console.log(result);
                if(result["message"]=="Token expired" || result["detail"]=="Invalid token." ){
                    this.handleLogout();
                } 
                var myEvents = [];
                var otherEvents = [];
                var attend = false;
                result.map(event => {
                    var attendees = [];
                    event.attendees.map(attendee=>{
                        attendees.push(attendee.username);
                        if(attendee.id.toString() == localStorage.getItem("id"))
                            attend = true
                    })
                    var t1 = new Date(event.datetime).getTime();
                    var curr = new Date().getTime();
                    if(curr < t1) {
                        var name = event.name;
                        var m = new Date(event.datetime);
                        var datetime = m.getUTCFullYear() + "/" +
                                        ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
                                        ("0" + m.getUTCDate()).slice(-2) + " " +
                                        ("0" + m.getUTCHours()).slice(-2) + ":" +
                                        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
                                        ("0" + m.getUTCSeconds()).slice(-2);
        
                        var location = event.location;
                        var description = event.description;
                        if(attend){
                            myEvents.push({id:event.id, name:name, datetime:datetime, location:location, description:description, attendee:attendees, path:'/event_details?id='+event.id})
                        } else {
                            otherEvents.push({id:event.id, name:name, datetime:datetime, location:location, description:description, attendee:attendees, path:'/event_details?id='+event.id})
                        }
                    }
                    attend = false
                })
                this.loaded = true;
                this.setState({
                    myEvents: myEvents,
                    otherEvents: otherEvents
                })
            });
    }

    leaveEvent(event_id, user_id) {
        console.log(event_id);
    }

    joinEvent(event_id, user_id) {
        console.log(event_id);
    }

    getEvents(events) {
        var i = 0;
        var length = events.length;
        var count = Math.ceil(length/3);
        var last = length%3;
        var listItems = [];
        for(i=0; i<count; i++){
            var ob;
            if(i==count-1){
                if(last==1){
                    ob = <ul key={events[i*3]["id"]} id='my' className='cards__items'><EventView
                    name={events[i*3]["name"]}
                    location={events[i*3]["location"]}
                    description={events[i*3]["description"]}
                    datetime={events[i*3]["datetime"]}
                    path={events[i*3]["path"]}
                    attendee={events[i*3]["attendee"]}
                    /><li className='cards__item'>
                    </li><li className='cards__item'>
                    </li></ul>
                } else if(last==2){
                    ob = <ul key={events[i*3]["id"]} id='my' className='cards__items'><EventView
                    name={events[i*3]["name"]}
                    location={events[i*3]["location"]}
                    description={events[i*3]["description"]}
                    datetime={events[i*3]["datetime"]}
                    path={events[i*3]["path"]}
                    attendee={events[i*3]["attendee"]}
                    /><EventView
                    name={events[i*3+1]["name"]}
                    location={events[i*3+1]["location"]}
                    description={events[i*3+1]["description"]}
                    datetime={events[i*3+1]["datetime"]}
                    path={events[i*3+1]["path"]}
                    attendee={events[i*3+1]["attendee"]}
                    /><li className='cards__item'>
                    </li></ul>
                }
            }
            if(ob==undefined) {
                ob = <ul key={events[i*3]["id"]} id='my' className='cards__items'><EventView
                    name={events[i*3]["name"]}
                    location={events[i*3]["location"]}
                    description={events[i*3]["description"]}
                    datetime={events[i*3]["datetime"]}
                    path={events[i*3]["path"]}
                    attendee={events[i*3]["attendee"]}
                    /><EventView
                    name={events[i*3+1]["name"]}
                    location={events[i*3+1]["location"]}
                    description={events[i*3+1]["description"]}
                    datetime={events[i*3+1]["datetime"]}
                    path={events[i*3+1]["path"]}
                    attendee={events[i*3+1]["attendee"]}
                    /><EventView
                    name={events[i*3+2]["name"]}
                    location={events[i*3+2]["location"]}
                    description={events[i*3+2]["description"]}
                    datetime={events[i*3+2]["datetime"]}
                    path={events[i*3+2]["path"]}
                    attendee={events[i*3+2]["attendee"]}
                    /></ul>
            }
            listItems.push(ob)
            ob=undefined;
        }
        return listItems;
    }
    
    createEvent() {
        window.location.href = '/create_event';
    }
    
    render(){
        if(!this.loaded)
            return (<div className='cards'><h2>Loading Event Data...</h2></div>)
        const myEvents = this.getEvents(this.state.myEvents);
        const otherEvents = this.getEvents(this.state.otherEvents);
        return (
            <div className='cards'>
                <h2>Your Events</h2>
                <div className='cards__container'>
                    <div className='cards__wrapper'>
                        {
                            myEvents.map(myEvents => (
                                myEvents
                            ))
                        }
                        <Button id="createEvent" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={this.createEvent}>CREATE AN EVENT</Button>
                    </div>
                </div>
                <h2>All other events</h2>
                <div className='cards__container'>
                    <div className='cards__wrapper'>
                        {
                            otherEvents.map(otherEvent => (
                                otherEvent
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Event;

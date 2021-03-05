import React from 'react';
import CardView from './CardView';
import '../Cards.css';
import { Button } from '../Button';

class Event extends React.Component {
    constructor(){
        super();
        this.state = {
            myEvents: [],
            otherEvents: []
        };
        this.token = localStorage.getItem('token');
        console.log(this.token);
    }

    deleteAuth= () =>{
        if (this.token != null)
        {
            return fetch('http://127.0.0.1:8000/api/logout/', {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${this.token}`, 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            }).then(response => console.log("User loged out",response.json()))
        }
    }

    handleLogout = async () =>{
        await this.deleteAuth();
        localStorage.clear();
        window.location.href='/';
    }
    componentDidMount(){
        fetch('http://ip-api.com/json')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                var name = "IN-AND-OUT";
                var datetime = "2021-02-03T15:00:00";
                var location = "930 Hilgard Ave, Los Angeles, CA 90024";
                var description = "Party";

                this.setState({
                    myEvents: [
                        {src:'images/img-beef.jpg', text: 'Steak House : 930 Hilgard Ave, Los Angeles, CA 90024', label:'Meal', path:'/service'}, 
                        {src:'images/img-philz.jpg', text: "Philz Coffee : 525 Santa Monica Blvd, Santa Monica, CA 90401", label:'Cafe', path:'/service'},
                        {src:'images/img-in-and-out.png', text: "IN-AND-OUT : 922 Gayley Ave, Los Angeles, CA 90024", label:'Meal', path:'/service'}
                    ],
                    otherEvents: [
                        {src:'images/img-beef.jpg', name: name, location:location, datetime:datetime, description:description, path:'/service'},
                        {src:'images/img-beef.jpg', name: name, location:location, datetime:datetime, description:description, path:'/service'},
                        {src:'images/img-beef.jpg', name: name, location:location, datetime:datetime, description:description, path:'/service'},
                        {src:'images/img-beef.jpg', name: name, location:location, datetime:datetime, description:description, path:'/service'}
                    ]
                })
            });
    }

    joinEvent(event_id) {

    }

    getOtherEvents(events) {
        var i = 0;
        var length = events.length;
        var count = Math.ceil(length/3);
        var last = length%3;
        var listItems = [];
        for(i=0; i<count; i++){
            var ob;
            if(i==count-1){
                if(last==1){
                    ob = <ul key={i*3} id='my' className='cards__items'><CardView
                    name={events[i*3]["name"]}
                    key={events[i*3]["text"]}
                    location={events[i*3]["location"]}
                    description={events[i*3]["description"]}
                    datetime={events[i*3]["datetime"]}
                    path={events[i*3]["path"]}
                    /><li className='cards__item'>
                    </li><li className='cards__item'>
                    </li></ul>
                } else if(last==2){
                    ob = <ul key={i*3} id='my' className='cards__items'><CardView
                    name={events[i*3]["name"]}
                    key={events[i*3]["text"]}
                    location={events[i*3]["location"]}
                    description={events[i*3]["description"]}
                    datetime={events[i*3]["datetime"]}
                    path={events[i*3]["path"]}
                    /><CardView
                    name={events[i*3+1]["name"]}
                    key={events[i*3+1]["text"]}
                    location={events[i*3+1]["location"]}
                    description={events[i*3+1]["description"]}
                    datetime={events[i*3+1]["datetime"]}
                    path={events[i*3+1]["path"]}
                    /><li className='cards__item'>
                    </li></ul>
                }
            }
            if(ob==undefined)
                ob = <ul key={i*3} id='my' className='cards__items'><CardView
                    name={events[i*3]["name"]}
                    key={events[i*3]["text"]}
                    location={events[i*3]["location"]}
                    description={events[i*3]["description"]}
                    datetime={events[i*3]["datetime"]}
                    path={events[i*3]["path"]}
                    /><CardView
                    name={events[i*3+1]["name"]}
                    key={events[i*3+1]["text"]}
                    location={events[i*3+1]["location"]}
                    description={events[i*3+1]["description"]}
                    datetime={events[i*3+1]["datetime"]}
                    path={events[i*3+1]["path"]}
                    /><CardView
                    name={events[i*3+2]["name"]}
                    key={events[i*3+2]["text"]}
                    location={events[i*3+2]["location"]}
                    description={events[i*3+2]["description"]}
                    datetime={events[i*3+2]["datetime"]}
                    path={events[i*3+2]["path"]}
                    /></ul>
            listItems.push(ob)
        }
        return listItems;
    }
    
    createEvent() {
        window.location.href = '/create_event';
    }
    
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyCY4-DiMtofTkDmGbLyL01OyXfdh1S0wBc
    //https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=ATtYBwKwwOlknJALhji-kYQzZHV0c3v7quYsrRU5b6Ci2qDuezSVvpHfSA59ZxaREMLUoKcaG7sOCHrxhdgp0bp0nCOAGnhDNpCVF5XV0hcOxE97WzyX3kMUkemmGmoaQopJuPnm7SRqKuNKQzDvCr0uGcWcpN1yRS3VmbZ4Z4Kzhkq8xx_r&sensor=false&key=AIzaSyCY4-DiMtofTkDmGbLyL01OyXfdh1S0wBc
    render(){
        const otherEvents = this.getOtherEvents(this.state.otherEvents);
        return (
            <div className='cards'>
                <h2>Your Events</h2>
                <div className='cards__container'>
                    <div className='cards__wrapper'>
                        {
                            <ul id='my' className='cards__items'>
                            {
                                this.state.myEvents.map(myEvents => (
                                    <CardView
                                    src={myEvents.src}
                                    key={myEvents.text}
                                    text={myEvents.text}
                                    label={myEvents.label}
                                    path={myEvents.path}
                                    />
                                ))
                            }
                            </ul>
                        }
                        <Button id="login" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={this.createEvent}>CREATE AN EVENT</Button>
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

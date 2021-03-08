import React from 'react';
import CardView from './CardView';
import '../Cards.css';
import { Button } from '../Button';
import EventView from './EventView';

class Recommend extends React.Component {
    constructor(){
        super();
        this.state = {
            restaurants: [],
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
        fetch('http://ip-api.com/json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.status == "success") {
                fetch('/api/recommendation/?latitude='+data.lat+'&longitude='+data.lon, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${this.token}`, 
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .then(result => {
                    data = typeof result == typeof "" ? JSON.parse(result) : result;
                    console.log(data)
                    if(data.length == 0 || data.length == undefined) {
                        this.loaded = true;
                        this.setState({
                            restaurants: [],
                        })
                    } else {
                        this.loaded = true;
                        var restaurants = [];
                        data.map(restaurant=>{
                            var name = restaurant.name;
                            var src = restaurant.image_url;
                            var label = restaurant.categories[0].title;
                            var id = restaurant.id;
                            var location = ""
                            restaurant.location.display_address.map(add => {
                                location += add + " ";
                            });
                            restaurants.push({id:id, name:name, src:src, label:label, location:location, path:"/create_event?name="+name+"&location="+location})
                        });
                        this.setState({
                            restaurants: restaurants,
                        })
                    }
                })
            } else {
                this.loaded = true;
                this.setState({
                    restaurants: [],
                })
            }
        });
    }

    getRestaurants(restaurants) {
        var i = 0;
        var length = restaurants.length;
        var count = Math.ceil(length/3);
        var last = length%3;
        var listItems = [];
        for(i=0; i<count; i++){
            var ob;
            if(i==count-1){
                if(last==1){
                    ob = <ul key={restaurants[i*3]["id"]} id='my' className='cards__items'><CardView
                    name={restaurants[i*3]["name"]}
                    location={restaurants[i*3]["location"]}
                    label={restaurants[i*3]["label"]}
                    src={restaurants[i*3]["src"]}
                    path={restaurants[i*3]["path"]}
                    /><li className='cards__item'>
                    </li><li className='cards__item'>
                    </li></ul>
                } else if(last==2){
                    ob = <ul key={restaurants[i*3]["id"]} id='my' className='cards__items'><CardView
                    name={restaurants[i*3]["name"]}
                    location={restaurants[i*3]["location"]}
                    label={restaurants[i*3]["label"]}
                    src={restaurants[i*3]["src"]}
                    path={restaurants[i*3]["path"]}
                    /><CardView
                    name={restaurants[i*3+1]["name"]}
                    location={restaurants[i*3+1]["location"]}
                    label={restaurants[i*3+1]["label"]}
                    src={restaurants[i*3+1]["src"]}
                    path={restaurants[i*3+1]["path"]}
                    /><li className='cards__item'>
                    </li></ul>
                }
            }
            if(ob==undefined) {
                ob = <ul key={restaurants[i*3]["id"]} id='my' className='cards__items'><CardView
                    name={restaurants[i*3]["name"]}
                    location={restaurants[i*3]["location"]}
                    label={restaurants[i*3]["label"]}
                    src={restaurants[i*3]["src"]}
                    path={restaurants[i*3]["path"]}
                    /><CardView
                    name={restaurants[i*3+1]["name"]}
                    location={restaurants[i*3+1]["location"]}
                    label={restaurants[i*3+1]["label"]}
                    src={restaurants[i*3+1]["src"]}
                    path={restaurants[i*3+1]["path"]}
                    /><CardView
                    name={restaurants[i*3+2]["name"]}
                    location={restaurants[i*3+2]["location"]}
                    label={restaurants[i*3+2]["label"]}
                    src={restaurants[i*3+2]["src"]}
                    path={restaurants[i*3+2]["path"]}
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
            return (<div className='cards'><h2>Loading Restaurants Data...</h2></div>)
        const restaurants = this.getRestaurants(this.state.restaurants);
        if(restaurants.length == 0 ){
            return (
            <div className='cards'>
                <h3>There are no recommendation found</h3><br></br>
                <h3>Have you created your preferences?</h3><br></br>
                <Button id="createEvent" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={() => window.location.href='/create'}>CREATE PREFERENCES</Button>
            </div>)
        }
        return (
            <div className='cards'>
                <h2>Recommendations to you!</h2>
                <div className='cards__container'>
                    <div className='cards__wrapper'>
                        {
                            restaurants.map(restaurants => (
                                restaurants
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Recommend;

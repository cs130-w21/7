
import React, {useState, useEffect} from 'react';
import CardView from './CardView';
import '../Cards.css';

function Recommend() {
    const [isLoading, setIsLoading] = useState(false);
    const [restaurants, setRestaurants] = useState({});
    
    var state = {
        listitem1: [
            {src:'images/img-beef.jpg', text: 'Steak House : 930 Hilgard Ave, Los Angeles, CA 90024', label:'Meal', path:'/service'}, 
            {src:'images/img-philz.jpg', text: "Philz Coffee : 525 Santa Monica Blvd, Santa Monica, CA 90401", label:'Cafe', path:'/service'},
            {src:'images/img-in-and-out.png', text: "IN-AND-OUT : 922 Gayley Ave, Los Angeles, CA 90024", label:'Meal', path:'/service'}]
    };

    const getUserLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }
    
    useEffect(async () => {
        var token = localStorage.getItem('token');
        const {coords} = await getUserLocation();
        const {latitude, longitude} = coords;
        
        const postLocation = async () => {
            setIsLoading(true);
            await fetch('http://127.0.0.1:8000/api/recommendation/?latitude='+latitude+'&longitude='+longitude, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`, 
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setRestaurants(data)
                setIsLoading(false);
            })
        }

        postLocation();


        
    },[])
    
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyCY4-DiMtofTkDmGbLyL01OyXfdh1S0wBc
    //https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=ATtYBwKwwOlknJALhji-kYQzZHV0c3v7quYsrRU5b6Ci2qDuezSVvpHfSA59ZxaREMLUoKcaG7sOCHrxhdgp0bp0nCOAGnhDNpCVF5XV0hcOxE97WzyX3kMUkemmGmoaQopJuPnm7SRqKuNKQzDvCr0uGcWcpN1yRS3VmbZ4Z4Kzhkq8xx_r&sensor=false&key=AIzaSyCY4-DiMtofTkDmGbLyL01OyXfdh1S0wBc
    return (
        <div className='cards'>
            {/* <h1>Here are some suggestions!</h1>
            <div className='cards__container'>
            <div className='cards__wrapper'>
                <ul id='listview' className='cards__items'>
                {
                    
                restaurants.map(li => (
                    <CardView
                    src={li.img_url}
                    key={li.alias}
                    text={li.location.display_address}
                    label={li.categories.alias}
                    path={li.url}
                    />
                ))}
                </ul>
            
            </div>
            </div> */}
        </div>
    );
}

export default Recommend;

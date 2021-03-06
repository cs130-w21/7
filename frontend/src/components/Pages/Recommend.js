import React from 'react';
import CardView from './CardView';
import '../Cards.css';

function Recommend() {
    var state = {
        listitem1: [
            {src:'images/img-beef.jpg', text: 'Steak House : 930 Hilgard Ave, Los Angeles, CA 90024', label:'Meal', path:'/service'}, 
            {src:'images/img-philz.jpg', text: "Philz Coffee : 525 Santa Monica Blvd, Santa Monica, CA 90401", label:'Cafe', path:'/service'},
            {src:'images/img-in-and-out.png', text: "IN-AND-OUT : 922 Gayley Ave, Los Angeles, CA 90024", label:'Meal', path:'/service'}]
    };
    fetch('http://ip-api.com/json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            state.listitem1.push({src:'images/img-beef.jpg', text: 'Hell', label:'T', path:'/service'});
        });

    
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyCY4-DiMtofTkDmGbLyL01OyXfdh1S0wBc
    //https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=ATtYBwKwwOlknJALhji-kYQzZHV0c3v7quYsrRU5b6Ci2qDuezSVvpHfSA59ZxaREMLUoKcaG7sOCHrxhdgp0bp0nCOAGnhDNpCVF5XV0hcOxE97WzyX3kMUkemmGmoaQopJuPnm7SRqKuNKQzDvCr0uGcWcpN1yRS3VmbZ4Z4Kzhkq8xx_r&sensor=false&key=AIzaSyCY4-DiMtofTkDmGbLyL01OyXfdh1S0wBc
    return (
        <div className='cards'>
            <h1>Here are some suggestions!</h1>
            <div className='cards__container'>
            <div className='cards__wrapper'>
                <ul id='listview' className='cards__items'>
                {
                state.listitem1.map(listitem1 => (
                    <CardView
                    src={listitem1.src}
                    key={listitem1.text}
                    text={listitem1.text}
                    label={listitem1.label}
                    path={listitem1.path}
                    />
                ))}
                </ul>
                <ul className='cards__items'>
                <CardView
                    src='images/img-800.jpg'
                    text='800 Degrees Pizza : 10889 Lindbrook Dr, Los Angeles, CA 90024
                    '
                    label='Pizza'
                    path='/services'
                />
                <CardView
                    src='images/img-le-pain-quotidien.jpeg'
                    text='Le Pain Quotidien : 1122 Gayley Ave, Los Angeles, CA 90024'
                    label='Italian'
                    path='/services'
                />
                <CardView
                    src='images/img-napa-valley-grille.jpeg'
                    text='Napa Valley Grille : 1100 Glendon Ave Ste 100, Los Angeles, CA 90024'
                    label='Steak'
                    path='/services'
                />
                </ul>
            </div>
            </div>
        </div>
    );
}

export default Recommend;

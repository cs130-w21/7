import React, { useState, useEffect, Component } from "react";
import '../../App.css';
import HabitList from '../HabitList';
import '../Cards.css';
import '../CreateProfile.css'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import cuisines from '../../assets/data/cuisines';
import types from '../../assets/data/types';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 5,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '50vh',
    marginTop: '100px',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '50ch',
    },
  },
  tabs: {
    marginLeft: '20%',
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  textfields: {
    paddingTop: 10,
    paddingLeft: 20,
  },
  button: {
    paddingTop: 150,
    paddingLeft: 20,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '50ch',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

}));

const placeholder_strings = [
  "Type a cuisine (American, Mexican, ...)",
  "Type a food type (Fast Food, Restaurants, Cafes ...)"
];

export default function Create() {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    "sex": "",
    "age": "",
    "height": "",
    "weight": ""
  });
  const classes = useStyles();


  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  function submitProfile() {
    console.log(profile)
  }

  return (
    <div className="Create">
      <form className="form" noValidate autoComplete="off" onSubmit={submitProfile}>
        <div className={classes.textfields}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="component-simple">First Name</InputLabel>
            <Input id="component-simple" name="first_name" value={profile.first_name} onChange={handleChange} />
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="component-simple">Last Name</InputLabel>
            <Input id="component-simple" name="last_name" value={profile.last_name} onChange={handleChange} />
          </FormControl>
        </div>

        <div className={classes.textfields}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="uncontrolled-native">Sex</InputLabel>
            <NativeSelect
              name="sex"
              value={profile.sex}
              onChange={handleChange}>
              <option value={'M'}>Male</option>
              <option value={'F'}>Female</option>
            </NativeSelect>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="component-simple">Age</InputLabel>
            <Input id="component-simple" name="age" value={profile.age} onChange={handleChange} />
          </FormControl>
        </div>

        <div className={classes.textfields}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="component-simple">Height</InputLabel>
            <Input id="component-simple" name="height" value={profile.height} onChange={handleChange} />
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="component-simple">Weight</InputLabel>
            <Input id="component-simple" name="weight" value={profile.weight} onChange={handleChange} />
          </FormControl>
        </div>
        <div className={classes.textfields}>
          <h1>Cuisines</h1>
          <HabitList placeholder={placeholder_strings[0]} data={cuisines}/>
          <h1>Food Types</h1>
          <HabitList placeholder={placeholder_strings[1]} data={types}/>
        </div>

        <div className={classes.button}>
          <Button type="submit" variant="contained" size="medium" color="primary" className={classes.margin}>
            Submit Profile
            </Button>
        </div>
      </form>

    </div>
  );
}

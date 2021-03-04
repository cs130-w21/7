import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import '../Settings.css'

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography component={'span'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
  
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
    button:{
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

  
export default function Setting() {
    const [isLoading, setIsLoading] = useState(false);
    const [profiles, setProfiles] = useState ([]);
    const [passwords, setPasswords] = useState ({
        old_password : "",
        new_password : ""
    });
    const [token, setToken] = useState("")
    const [email, setEmail] = useState("")
    const [form, setForm] = useState({
        errorPassword: false,
        helperTextPassword: "",
        helperTextSuccess: ""
    })
    const [isOpened, setIsOpened] = useState(false);

    useEffect(() => {
        var getToken = localStorage.getItem('token');
        var getEmail = localStorage.getItem('email');
        if (token !== null)
        {
            const fetchProfiles = async () => {
                setIsLoading(true);
                await fetch('http://127.0.0.1:8000/api/profile/get/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${getToken}`, 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        }, 
                })
                .then(res => res.json())
                .then(data => {
                    setProfiles(data);
                    setToken(getToken);
                    setEmail(getEmail);
                    setIsLoading(false);
                    
                })
                
              };
            fetchProfiles();
        }    
    }, []);
    const classes = useStyles();
    const [valuepanel, setValuepanel] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setValuepanel(newValue);
    }

    const handleChange = (e) => {
        setProfiles({
          ...profiles,
          [e.target.name]: e.target.value
        });
    };
    
    const submitUpdateProfile = (event) => {
        event.preventDefault() 
        const updateProfile = async() => {
            await fetch('http://127.0.0.1:8000/api/profile/update/', {
                method : 'PUT',
                headers: {
                    'Authorization': `Token ${token}`, 
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(
                    profiles
                )
            })
            .then(res => res.json())
            .then(result => {
                setIsOpened(wasOpened => !wasOpened);
  
            })
        };
        updateProfile();
    }

    const handleChangePassword = (e) => {
        setPasswords({
          ...passwords,
          [e.target.name]: e.target.value
        });
    };

    const submitChangePassword = async (event) => {
        event.preventDefault();
        fetch('http://127.0.0.1:8000/api/update_password/', {
            method : 'POST',
            headers: {
                'Authorization': `Token ${token}`, 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                old_password: passwords.old_password,
                new_password: passwords.new_password    
            })
        })
        .then(res => res.json())
        .then(result => {
            var resMessage = result.message
            if (resMessage === "Wrong password"){
                setForm({
                    ...form,
                    helperTextPassword: "Wrong Password",
                    errorPassword: true
                })
            }else{
                setForm({
                    ...form,
                    errorPassword: false,
                    helperTextPassword: "",
                    helperTextSuccess: "Successfully Updated Password",
                })
            }
        })
        passwords.old_password = "";
        passwords.new_password = "";
    }



    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={valuepanel}
                onChange={handleTabChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                <Tab label="Profile" {...a11yProps(0)} />
                <Tab label="Account Security" {...a11yProps(1)} />
            </Tabs>
            {isLoading ? (
                <div>Loading ...</div>
            ) : (<div>
            <TabPanel value={valuepanel} index={0}>
                <form noValidate autoComplete="off" onSubmit={submitUpdateProfile}>
                    <div className={classes.textfields}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">First Name</InputLabel>
                            <Input id="component-simple" name="first_name" value={profiles.first_name} onChange={handleChange} />
                        </FormControl>

                        <FormControl  className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Last Name</InputLabel>
                            <Input id="component-simple" name="last_name" value={profiles.last_name} onChange={handleChange} />
                        </FormControl>
                    </div>

                    <div className={classes.textfields}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="uncontrolled-native">Sex</InputLabel>
                            <NativeSelect
                            name="sex"
                            value={profiles.sex}
                            onChange={handleChange}>
                                <option value={'M'}>Male</option>
                                <option value={'F'}>Female</option>
                            </NativeSelect>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Age</InputLabel>
                            <Input id="component-simple" name="age" value={profiles.age} onChange={handleChange} />
                        </FormControl>
                    </div>
                    
                    <div className={classes.textfields}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Height</InputLabel>
                            <Input id="component-simple" name="height" value={profiles.height} onChange={handleChange} />
                        </FormControl>

                        <FormControl  className={classes.formControl}>
                            <InputLabel htmlFor="component-simple">Weight</InputLabel>
                            <Input id="component-simple" name="weight" value={profiles.weight} onChange={handleChange} />
                        </FormControl>
                    </div>
                
                    <div className={classes.textfields}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="uncontrolled-native">Vegetarian</InputLabel>
                            <NativeSelect
                            name="vegetarian"
                            value={profiles.vegetarian}
                            onChange={handleChange}>
                            <option value={'true'}>Yes</option>
                            <option value={'false'}>No</option>
                            </NativeSelect>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="uncontrolled-native">Diet Plan</InputLabel>
                            <NativeSelect
                            name="diet_plan"
                            value={profiles.diet_plan}
                            onChange={handleChange}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    {isOpened && (
                    <div id='success' className={classes.textfields}>Successfully updated profile</div>
                    )}
                    <div className={classes.button}>
                        <Button type="submit" variant="contained" size="medium" color="primary" className={classes.margin}>
                            Update Changes
                        </Button>
                    </div>
                </form>
                
            </TabPanel>

            <TabPanel value={valuepanel} index={1}>
                <form onSubmit={submitChangePassword}>
                    <div className={classes.textfields}>
                    <TextField
                            id="standard-read-only-input"
                            label="Email"
                            defaultValue={email}
                            InputProps={{
                                readOnly: true,
                            }}
                            />
                    </div>
                    <div className={classes.textfields}>
                        <TextField
                            id="standard-read-only-input"
                            label="Username"
                            defaultValue={profiles.username}
                            InputProps={{
                                readOnly: true,
                            }}
                            />
                    </div>
                    <div className={classes.textfields}>
                    <TextField
                        error={form.errorPassword}
                        helperText={form.helperTextPassword}
                        id="standard-password-input"
                        label="Current Password"
                        type="password"
                        name = "old_password"
                        value={passwords.old_password}
                        autoComplete="current-password"
                        onChange={handleChangePassword}
                        />
                    </div>
                    <div className={classes.textfields}>
                    <TextField
                        id="standard-password-input"
                        helperText={form.helperTextSuccess}
                        label="New Password"
                        type="password"
                        name = "new_password"
                        value={passwords.new_password}
                        autoComplete="new-password"
                        onChange={handleChangePassword}
                        />
                    </div>
                    <div className={classes.textfields}>
                        <p>*Note: Contact Customer Service to change your email and username.</p>
                    </div>
                    <div className={classes.button}>
                        <Button type="submit" variant="contained" size="medium" color="primary" className={classes.margin}>
                            Update Changes
                        </Button>
                    </div>
                </form>
            </TabPanel>

            </div>
            )}
        </div>
    );
      
}
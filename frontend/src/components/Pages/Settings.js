import React, { useState, useEffect } from 'react'
import { AppContext } from '../../App'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
        {value == index && (
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
    }

  }));

  
export default function Setting() {
    const [isLoading, setIsLoading] = useState(false);
    const [profiles, setProfiles] = useState ([])

    useEffect(() => {
        var token = localStorage.getItem('token');
        console.log("token",token)
        if (token != null)
        {
            const fetchProfiles = async () => {
                setIsLoading(true);
                await fetch('http://127.0.0.1:8000/api/profile/get/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`, 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        }, 
                })
                .then(res => res.json())
                .then(data => {
                    setProfiles(data);
                    setIsLoading(false);
                })
                
              };
           
              fetchProfiles();
        }    
    }, []);
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                <Tab label="Profile" {...a11yProps(0)} />
                <Tab label="Account Security" {...a11yProps(1)} />
                <Tab label="Plans" {...a11yProps(2)} />
            </Tabs>
            {isLoading ? (
                <div>Loading ...</div>
            ) : (
            <div>
            <TabPanel value={value} index={0}>
                <div className={classes.textfields}>
                    <TextField id="standard-uncontrolled" label="First Name" defaultValue={profiles.first_name} />
                    <TextField id="standard-uncontrolled" label="Last Name" defaultValue={profiles.last_name} />
                </div>
                <div className={classes.textfields}>
                    <TextField id="standard-uncontrolled" label="Sex" defaultValue={profiles.sex} />
                    <TextField id="standard-uncontrolled" label="Age" defaultValue={profiles.age} />
                </div>
                <div className={classes.textfields}>
                    <TextField id="standard-uncontrolled" label="Height" defaultValue={profiles.height} />
                    <TextField id="standard-uncontrolled" label="Weight" defaultValue={profiles.weight} />
                </div>
                <div className={classes.button}>
                    <Button variant="contained" size="medium" color="primary" className={classes.margin}>
                        Update
                    </Button>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className={classes.textfields}>
                    <TextField id="standard-uncontrolled" label="Email" defaultValue="foo" />
                </div>
                <div className={classes.textfields}>
                    <TextField id="standard-uncontrolled" label="Username" defaultValue="foo" />
                </div>
                <div className={classes.textfields}>
                    <TextField id="standard-uncontrolled" label="Password" defaultValue="foo" />
                </div>
                <div className={classes.button}>
                    <Button variant="contained" size="medium" color="primary" className={classes.margin}>
                        Update
                    </Button>
                </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
            </div>
            )}
        </div>
    );
      
}
import React, {useState} from 'react';

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';

const tileData = [
    { 
        img: 'images/img-800.jpg',
        title: 'Pizza',
    },
    { 
        img: 'images/img-800.jpg',
        title: 'Pizza',
    },
    { 
        img: 'images/img-800.jpg',
        title: 'Pizza',
    },
    { 
        img: 'images/img-800.jpg',
        title: 'Pizza',
    },
    { 
        img: 'images/img-800.jpg',
        title: 'Pizza',
    },
    { 
        img: 'images/img-800.jpg',
        title: 'Pizza',
    },
];

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 500
    },
    icon: {
        color: 'white',
    },
  }),
);


export default function HabitList(props) {
    const classes = useStyles();
    const [background, setColor] = useState('');


    function handleAddHabit(e, habit) {
        console.log(`Added new habit: ${habit}`); 
    }

    return (
    <div className={classes.root}>
        <GridList cellHeight={200} className={classes.gridList} cols={3}>
        
        <GridListTile key="Subheader" cols={3} style={{ height: 'auto' }}>
            <ListSubheader component="div">Breakfast</ListSubheader>
        </GridListTile>
        {tileData.map((tile) => ( 
            <GridListTile key= {tile.img} cols="1" style={{backgroundColor: background}}>
                <img src={tile.img} alt={tile.title} />
                <GridListTileBar
                    title={tile.title}
                    actionIcon={
                        <IconButton aria-label={`checkbox ${tile.title}`} onClick={(e)=>handleAddHabit(e, tile.title)}>
                            <Add className={classes.icon} />
                        </IconButton>
                    }
                />
            </GridListTile>
        ))}

        <GridListTile key="Subheader" cols={3} style={{ height: 'auto' }}>
            <ListSubheader component="div">Lunch</ListSubheader>
        </GridListTile>
            {tileData.map((tile) => ( 
                <GridListTile key= {tile.img} cols="1" style={{backgroundColor: background}}>
                    <img src={tile.img} alt={tile.title} />
                    <GridListTileBar
                        title={tile.title}
                        actionIcon={
                            <IconButton aria-label={`checkbox ${tile.title}`} onClick={(e)=>handleAddHabit(e, tile.title)} >
                                <Add className={classes.icon} />
                            </IconButton>
                        }
                    />
                </GridListTile>
            ))}
        
        <GridListTile key="Subheader" cols={3} style={{ height: 'auto' }}>
            <ListSubheader component="div">Dinner</ListSubheader>
        </GridListTile>
            {tileData.map((tile) => ( 
                <GridListTile key= {tile.img} cols="1" style={{backgroundColor: background}}>
                    <img src={tile.img} alt={tile.title} />
                    <GridListTileBar
                        title={tile.title}
                        actionIcon={
                            <IconButton aria-label={`checkbox ${tile.title}`} onClick={(e)=>handleAddHabit(e, tile.title)} >
                                <Add className={classes.icon}/>
                            </IconButton>
                        }
                    />
                </GridListTile>
            ))}

        </GridList>
    </div>
    );
}

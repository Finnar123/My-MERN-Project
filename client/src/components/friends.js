import React, {useEffect} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems } from './tools/ListItems';
import Friendtable from './tools/friendtable';

import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProtectedRoute } from '../auth/index';
import { getFriends } from '../actions/friendActions';
import AppBar from './tools/Appbar';
import Copyright from './tools/Copyright';
import Drawer from './tools/Drawer';



const mdTheme = createTheme();

function DashboardContent(props) {

  const navigate = useNavigate();
  const dispatch = useDispatch();


  // if the user signs up or signs up 
  const { user, userUp} = props;
  let mainuser = user != null ? user : userUp;


  useEffect(() =>{
    
    dispatch(getFriends(mainuser.email)).then(() => {

      
    })
    .catch(error => {
      
    });
  });
    
    

  useEffect(() => {  
    

    if(user == null && userUp == null) navigate('/signin');
  
    getProtectedRoute().then(response => {
      console.log("Success");
      
    }).catch(error => {
      console.log(error);
      
      navigate('/signin');
  
    })
  
  }, [navigate, user, userUp])
  
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };


  function handleLogout() {
    localStorage.removeItem('jwt');
    
    dispatch({ type: 'PURGE'});
    // Redirect the user to the login page
    
    navigate('/signin');
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Welcome, {mainuser.username }
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />


          {/* CONTAINER */}
          <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }} style={{ height: '80%'}} >

          <Typography variant="h6" color="primary" sx={{ mb: 2, fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>
            Friends
          </Typography>
        
          <Friendtable/>

            <Copyright sx={{ pt: 1 }} />
          </Container>

        </Box>
      </Box>
    </ThemeProvider>
  );
}


const mapStateToProps = state => {
  return {
    user: state.user.user,
    userUp: state.userUp.user,
  };
};

const ConnectedDashboardContent = connect(mapStateToProps)(DashboardContent);

export default function Dashboard() {
  return <ConnectedDashboardContent />;
}
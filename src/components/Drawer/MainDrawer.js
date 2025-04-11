import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HistoryIcon from '@mui/icons-material/History';
import { Outlet } from 'react-router-dom';
import logo from '../../assets/images/logo.jpeg';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styled from 'styled-components';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ArticleIcon from '@mui/icons-material/Article';

const topbarColor = '#1976d2';
const inactiveColor = '#000';
const drawerWidth = 290;

const getTitleFromPath = (path) => {
  switch (path) {
    case '/customers':
      return 'Customers';
    case '/approval-form':
      return 'Send Document for Sign';
    case '/profile':
      return 'Profile';
    case '/groups':
      return 'Groups';
    case '/logs':
      return 'Logs';
    case '/manage-forms':
      return 'Manage Forms';
      case '/import-data':
        return 'Import Data';
        case '/documents-list':
          return 'Documents List';
    default:
      return 'Page';
  }
};

function MainDrawer({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const settings = ['Profile', 'Logout'];

  const drawer = (
    <div>
      <Toolbar>
        <LogoContainer>
          <img src={logo} alt='Logo' />
          <h1>AQ Sign</h1>
        </LogoContainer>
      </Toolbar>
      <Divider />
      <List>
        <ListItem key="customers" disablePadding>
          <ListItemButton component={Link} to="/customers" sx={{ color: currentPath === '/customers' ? topbarColor : inactiveColor }}>
            <ListItemIcon sx={{ color: currentPath === '/customers' ? topbarColor : inactiveColor }}>
              <PersonOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" primaryTypographyProps={{ style: { color: currentPath === '/customers' ? topbarColor : inactiveColor } }} />
          </ListItemButton>
        </ListItem>
        <ListItem key="Send Document for Sign" disablePadding>
          <ListItemButton component={Link} to="/approval-form" sx={{ color: currentPath === '/approval-form' ? topbarColor : inactiveColor }}>
            <ListItemIcon sx={{ color: currentPath === '/approval-form' ? topbarColor : inactiveColor }}>
              <AssignmentTurnedInIcon />
            </ListItemIcon>
            <ListItemText primary="Send Document for Sign" primaryTypographyProps={{ style: { color: currentPath === '/approval-form' ? topbarColor : inactiveColor } }} />
          </ListItemButton>
        </ListItem><ListItem key="documents-list" disablePadding>
  <ListItemButton component={Link} to="/documents-list" sx={{ color: currentPath === '/documents-list' ? topbarColor : inactiveColor }}>
    <ListItemIcon sx={{ color: currentPath === '/documents-list' ? topbarColor : inactiveColor }}>
      <DescriptionIcon />
    </ListItemIcon>
    <ListItemText primary="Documents List" primaryTypographyProps={{ style: { color: currentPath === '/documents-list' ? topbarColor : inactiveColor } }} />
  </ListItemButton>
</ListItem>
        <ListItem key="groups" disablePadding>
          <ListItemButton component={Link} to="/groups" sx={{ color: currentPath === '/groups' ? topbarColor : inactiveColor }}>
            <ListItemIcon sx={{ color: currentPath === '/groups' ? topbarColor : inactiveColor }}>
              <PeopleAltIcon />
            </ListItemIcon>
            <ListItemText primary="Groups" primaryTypographyProps={{ style: { color: currentPath === '/groups' ? topbarColor : inactiveColor } }} />
          </ListItemButton>
        </ListItem>
        <ListItem key="logs" disablePadding>
          <ListItemButton component={Link} to="/logs" sx={{ color: currentPath === '/logs' ? topbarColor : inactiveColor }}>
            <ListItemIcon sx={{ color: currentPath === '/logs' ? topbarColor : inactiveColor }}>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="Logs" primaryTypographyProps={{ style: { color: currentPath === '/logs' ? topbarColor : inactiveColor } }} />
          </ListItemButton>
        </ListItem>
        <ListItem key="manage-forms" disablePadding>
          <ListItemButton component={Link} to="/manage-forms" sx={{ color: currentPath === '/manage-forms' ? topbarColor : inactiveColor }}>
            <ListItemIcon sx={{ color: currentPath === '/manage-forms' ? topbarColor : inactiveColor }}>
              <ArticleIcon  />
            </ListItemIcon>
            <ListItemText primary="Manage Forms" primaryTypographyProps={{ style: { color: currentPath === '/manage-forms' ? topbarColor : inactiveColor } }} />
          </ListItemButton>
        </ListItem>
        <ListItem key="import-data" disablePadding>
          <ListItemButton component={Link} to="/import-data" sx={{ color: currentPath === '/import-data' ? topbarColor : inactiveColor }}>
            <ListItemIcon sx={{ color: currentPath === '/import-data' ? topbarColor : inactiveColor }}>
            <FolderOpenIcon />
            </ListItemIcon>
            <ListItemText primary="Import Data" primaryTypographyProps={{ style: { color: currentPath === '/import-data' ? topbarColor : inactiveColor } }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, backgroundColor: topbarColor }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {getTitleFromPath(location.pathname)}
          </Typography>
          <Box sx={{ flexGrow: 0, ml: 'auto' }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Profile" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu sx={{ mt: '45px' }} anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  {setting === 'Logout' ? (
                    <ListItemButton onClick={handleLogout} sx={{ textAlign: 'center' }}>
                      <Typography>Logout</Typography>
                    </ListItemButton>
                  ) : (
                    <ListItemButton component={Link} to="/profile" sx={{ color: currentPath === '/profile' ? topbarColor : inactiveColor }}>
                      <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                    </ListItemButton>
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }} open>
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainDrawer;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
  width: 100%;

  img {
    width: 100px;
    height: 100px;
  }

  h1 {
    font-size: 28px;
    font-weight: bold;
    color: #1976d2; /* Dark blue shade */
    text-transform: uppercase;
    letter-spacing: 3px;
  }
`;

import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Switch, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { Settings } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  onAccentChange: (color: string) => void;
  accentColor: string;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme, onAccentChange, accentColor }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user, logout } = useContext(AuthContext);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Personal Journal & Money Manager
        </Typography>
        {user && (
          <>
            <Button color="inherit" component={Link} to="/">Dashboard</Button>
            <Button color="inherit" component={Link} to="/journal">Journal</Button>
            <Button color="inherit" component={Link} to="/transactions">Transactions</Button>
            <Button color="inherit" component={Link} to="/goals">Goals</Button>
            <Button color="inherit" component={Link} to="/data">Data</Button>
            <Button color="inherit" component={Link} to="/reminders">Reminders</Button>
          </>
        )}
        {user && (
  <>
    <Button color="inherit" component={Link} to="/advanced-analytics">Analytics</Button>
    <Button color="inherit" component={Link} to="/prompts">Prompts</Button>
  </>
)}

        {user ? (
          <Button color="inherit" onClick={logout}>Logout</Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
        <Switch checked={darkMode} onChange={toggleTheme} />
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <Settings />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem>
            <TextField
              label="Accent Color"
              type="color"
              value={accentColor}
              onChange={(e) => onAccentChange(e.target.value)}
            />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

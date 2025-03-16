import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Personal Journal & Money Manager
        </Typography>
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/journal">Journal</Button>
        <Button color="inherit" component={Link} to="/transactions">Transactions</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

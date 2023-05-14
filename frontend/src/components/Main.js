import { Button, Container, TextField, Typography, makeStyles } from '@mui/material';
import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  textField: {
    margin: theme.spacing(1),
    width: '100%',
    maxWidth: 300,
  },
  button: {
    margin: theme.spacing(1),
    width: '100%',
    maxWidth: 300,
  },
}));

const socket = io("https://localhosst:5000");

const TokenDashboard = () => {
  const classes = useStyles();
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/token_system/patients');
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPatients();
  }, []);

  const handleAddPatient = async () => {
    try {
      const response = await fetch('/token_system/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });
      const data = await response.json();
      setPatients([...patients, data]);
      setName('');
      socket.emit('new-patient');
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextToken = async () => {
    try {
      const response = await fetch('/token_system/current-token', {
        method: 'PUT',
      });
      const data = await response.json();
      setPatients(data);
      socket.emit('next-token');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className={classes.root} maxWidth="md">
      <Typography variant="h4" align="center">
        Token Dashboard
      </Typography>
      <form className={classes.form}>
        <TextField
          className={classes.textField}
          label="Name"
          variant="outlined"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleAddPatient}
        >
          Add Patient
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={handleNextToken}
        >
          Next Token
        </Button>
      </form>
    </Container>
  );
};

export default TokenDashboard;

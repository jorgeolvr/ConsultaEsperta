import React from 'react'

//import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, Container, CssBaseline, Typography, Avatar,
  //Paper, Button, TextField
} from '@material-ui/core'

import SettingsIcon from '@material-ui/icons/Settings'
import { makeStyles } from '@material-ui/core/styles'

export default function Settings({ history }) {
  const styles = useStyles()

  return (
    <React.Fragment>
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <Header />
          </Container>
          <Container maxWidth="sm" component="main" className={styles.mainContainer}>
            <Avatar className={styles.avatar}>
              <SettingsIcon />
            </Avatar>
            <Typography
              className={styles.mainTitle}
              component="h2"
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Meus ajustes
            </Typography>
            <Container maxWidth="sm">
              <Typography
                component="h5"
                variant="h6"
                align="center"
                color="textSecondary"
              >
                Modifique as principais características do aplicativo,
                como alterar ou excluir a sua conta.
              </Typography>
            </Container>
          </Container>
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  mainGrid: {
    backgroundColor: '#F5FFFA',
    minHeight: '100vh',
  },
  mainTitle: {
    fontWeight: 'bold',
    color: '#322153',
    fontFamily: 'Ubuntu',
  },
  secondaryTitle: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(3)
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginBottom: theme.spacing(8),
  },
  firstButton: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  secondButton: {
    marginTop: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  mainContainer: {
    padding: theme.spacing(6, 0, 6),
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  typography: {
    fontWeight: 'bold',
    marginRight: 5
  },
  title: {
    marginTop: theme.spacing(2),
    fontWeight: 'bold'
  },
}))
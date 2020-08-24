import React from 'react'

import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, Container, CssBaseline, Typography, Avatar,
  Paper, Button, TextField
} from '@material-ui/core'

import CommentIcon from '@material-ui/icons/Comment'

import { makeStyles } from '@material-ui/core/styles'

export default function Rating({ history }) {
  const styles = useStyles()

  function handleDelete() {

  }

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
              <CommentIcon />
            </Avatar>
            <Typography
              className={styles.mainTitle}
              component="h2"
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Minhas avaliações
              </Typography>
            <Container maxWidth="sm">
              <Typography
                component="h5"
                variant="h6"
                align="center"
                color="textSecondary"
              >
                Avalie e atribua notas a um profissional da saúde que
                você teve uma consulta marcada.
              </Typography>
            </Container>
          </Container>
          <main className={styles.layout}>

          </main>
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  mainGrid: {
    minHeight: '100vh',
    backgroundColor: '#F5FFFA'
  },
  mainContainer: {
    padding: theme.spacing(6, 0, 6),
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
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
  mainTitle: {
    fontWeight: 'bold',
    color: '#322153',
    fontFamily: 'Ubuntu',
  },
  paper: {
    marginBottom: theme.spacing(8),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  title: {
    marginTop: theme.spacing(2),
    fontWeight: 'bold'
  },
  typography: {
    fontWeight: 'bold',
    marginRight: 5
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  }
}))
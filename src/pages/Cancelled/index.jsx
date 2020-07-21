import React from 'react'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, CssBaseline, Container, Typography, Paper, Button
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

export default function Cancelled({ history }) {
  const styles = useStyles()

  function handleBack() {
    history.push('/schedule')
  }
  function handleHome() {
    history.push('/home')
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
            <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
              Minha agenda
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" component="p">
              Confirme e visualize dados de todas as consultas que você marcou.
            </Typography>
          </Container>
          <main className={styles.layout}>
            <Paper elevation={3} className={styles.paper}>
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Você cancelou sua consulta :(
                </Typography>
                <Typography variant="subtitle1">
                  Se mudar de ideia pode marcar novamente.
                  O seu histórico de consultas ficará sempre disponível na sua agenda.
                 </Typography>
                <div className={styles.buttons}>
                  <Button color="textSecondary" onClick={handleBack} className={styles.button}>
                    Voltar
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleHome} className={styles.button}>
                    Ir para tela inicial
                  </Button>
                </div>
              </React.Fragment>
            </Paper>
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
    padding: theme.spacing(8, 0, 6),
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
    fontWeight: 'bold'
  },
  paper: {
    marginBottom: theme.spacing(8),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  }
}));
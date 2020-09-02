import React, { useState, useEffect } from 'react'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  TextField, Button, Paper, Container, Link, Grid,
  CssBaseline, Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import firebase from '../../config/Firebase'
import logo from '../../assets/logo-consulta.png'

export default function Forgot({ history }) {
  const styles = useStyles();

  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')

  useEffect(() => {
    if (firebase.getId() !== null) {
      history.push('/home')
    }
  })

  function handleLogin() {
    history.push('/login')
  }

  function sendEmail() {
    try {
      if (email === confirmEmail) {
        firebase.resetPassword(email)
        alert("Você receberá em email para definir uma nova senha")
      } else {
        alert('Os campos digitados se diferem, por favor digite novamente.')
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <React.Fragment>
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <Header />
          </Container>
          <Grid className={styles.background} container alignItems="center" justify="center" >
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Paper elevation={3} className={styles.paper}>
                <img src={logo} alt="Consulta Esperta" height="90em" />
                <form className={styles.form} onSubmit={e => e.preventDefault() && false} noValidate>
                  <Typography component="h6" color="textSecondary" gutterBottom>
                    Ao solicitar essa mudança, você receberá um email para a realização da troca de senha.
                    Por favor, preencha os campos abaixo:
                    </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        autoFocus
                        id="email"
                        label="Endereço de e-mail"
                        name="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="email"
                        label="Confirmar endereço de e-mail"
                        name="email"
                        value={confirmEmail}
                        onChange={event => setConfirmEmail(event.target.value)}
                        autoComplete="email"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    onClick={sendEmail}
                    variant="contained"
                    color="defaut"
                    className={styles.btn}>
                    Solicitar
                    </Button>
                  <Grid container justify="center">
                    <Grid item>
                      <Link
                        component="button"
                        onClick={handleLogin}
                        className={styles.link}
                        variant="body2">
                        Voltar para a tela de login
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Container>
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  background: {
    backgroundColor: '#F5FFFA',
    minHeight: '100vh'
  },
  mainGrid: {
    backgroundColor: '#F5FFFA',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  btn: {
    margin: theme.spacing(4, 0, 2, 0)
  },
  label: {
    color: '#8A8F9E',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: '12px'
  },
  link: {
    //fontFamily: "Arial",
    color: '#8A8F9E',
    fontSize: '12px',
    margin: theme.spacing(1, 0, 0, 0)
  }
}));


import React, { useState } from 'react'

import Header from '../../components/MainHeader'
import Footer from '../../components/Footer'

import {
  TextField, IconButton, InputAdornment, Button, Paper, Container,
  Link, Grid, CssBaseline, Divider
} from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles'


import firebase from '../../config/Firebase'
import logo from '../../assets/logo-consulta.png'

export default function Register({ history }) {
  const styles = useStyles();

  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false
  })

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleMouseDownConfirmPassword = event => {
    event.preventDefault();
  };

  function handleLogin() {
    history.push('/login')
  }

  async function handleRegister() {
    try {
      if (values.password === values.confirmPassword) {
        await firebase.register(name, lastName, email, values.password)
        history.push('/home')
      } else {
        alert('As senhas digitadas nos campos se diferem, por favor digite novamente.')
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
        </Grid>
      </Grid>
      <Grid className={styles.background} container alignItems="center" justify="center">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Paper elevation={3} className={styles.paper}>
            <img src={logo} alt="Consulta Esperta" height="90em" />
            <form className={styles.form} onSubmit={e => e.preventDefault() && false} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoFocus
                    fullWidth
                    id="firstName"
                    label="Nome"
                    name="firstName"
                    value={name}
                    onChange={event => setName(event.target.value)}
                    autoComplete="fname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    label="Sobrenome"
                    name="lastName"
                    value={lastName}
                    onChange={event => setLastName(event.target.value)}
                    autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
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
                    name="password"
                    label="Senha"
                    type={values.showPassword ? 'text' : 'password'}
                    id="password"
                    value={values.password}
                    onChange={handleChange('password')}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label="Confirmar senha"
                    type={values.showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownConfirmPassword}>
                            {values.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                onClick={handleRegister}
                variant="contained"
                color="defaut"
                className={styles.btn}>
                Cadastrar
              </Button>
              <Grid container justify="center">
                <Grid item>
                  <Link
                    component="button"
                    onClick={handleLogin}
                    className={styles.link}
                    variant="body2">
                    Já possui uma conta? Entre aqui
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Grid>
      <Divider />
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
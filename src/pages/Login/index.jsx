import React, { useState, useEffect } from 'react'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  TextField, IconButton, InputAdornment, Button, Paper, Container, Link, Grid,
  CssBaseline, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Slide
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { FaGoogle, FaFacebookSquare } from "react-icons/fa";

import firebase from '../../config/Firebase'
import logo from '../../assets/logo-consulta.png'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function Login({ history }) {
  const styles = useStyles();
  const [openDialog, setOpenDialog] = useState(false)

  const [email, setEmail] = useState('')
  const [values, setValues] = useState({
    password: '',
    showPassword: false
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (firebase.getId() !== null) {
      history.push('/home')
    }
  })

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  function handleRegister() {
    history.push('/register')
  }

  function handleForgotPassword() {
    history.push("/forgot")
  }

  async function handleLogin() {
    try {
      await firebase.login(email, values.password)
      history.push('/home')
    } catch (error) {
      if (error.message === 'The email address is badly formatted.') {
        setError('Esse endereço de e-mail está mal formatado.')
      } else if (error.message === 'The password is invalid or the user does not have a password.') {
        setError('A senha é invalida ou esse usuário não possui uma senha.')
      } else if (error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
        setError('Não há um registro de usuário correspondente a essa identificação. O usuário pode ter sido deletado.')
      } else {
        setError(error.message)
      }
      setOpenDialog(true)
    }
  }

  async function handleFacebookLogin() {
    try {
      await firebase.loginFacebook()
      history.push('/home')
    } catch (error) {
      setError(error.message)
    }
  }

  async function handleGoogleLogin() {
    try {
      await firebase.loginGoogle()
      history.push('/home')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <React.Fragment>
      <div>
        <Dialog open={openDialog} onClose={handleClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Erro de login</DialogTitle>
          <DialogContent>
            <DialogContentText>{error}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <Header />
          </Container>
          <Grid className={styles.background} container alignItems="center" justify="center">
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Paper elevation={3} className={styles.paper}>
                <img src={logo} alt="Consulta Esperta" height="90em" />
                <form className={styles.form} onSubmit={e => e.preventDefault() && false} noValidate>
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
                      <Grid container justify="flex-end" >
                        <Grid item>
                          <Link
                            component="button"
                            onClick={handleForgotPassword}
                            className={styles.link}
                            variant="body2">
                            Esqueceu a senha?
										</Link>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    onClick={handleLogin}
                    variant="contained"
                    color="defaut"
                    className={styles.btnEmail}>
                    Entrar
          				</Button>
                  <label className={styles.label}>• ou •</label>
                  <Button startIcon={<FaGoogle />}
                    type="submit"
                    fullWidth
                    onClick={handleGoogleLogin}
                    variant="contained"
                    color="secondary"
                    className={styles.btnGoogle}>
                    Login com o Google
          				</Button>
                  <Button
                    startIcon={<FaFacebookSquare />}
                    type="submit"
                    fullWidth
                    onClick={handleFacebookLogin}
                    variant="contained"
                    color="primary"
                    className={styles.btnFacebook}>
                    Login com Facebook
          				</Button>
                  <Grid container justify="center">
                    <Grid item>
                      <Link
                        component="button"
                        onClick={handleRegister}
                        className={styles.link}
                        variant="body2">
                        Novo por aqui? Cadastre-se
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
    </React.Fragment >
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
  btnEmail: {
    margin: theme.spacing(2, 0, 2, 0)
  },
  btnGoogle: {
    margin: theme.spacing(2, 0, 1, 0)
  },
  btnFacebook: {
    margin: theme.spacing(0, 0, 1, 0)
  },
  label: {
    color: '#8A8F9E',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: '12px'
  },
  link: {
    color: '#8A8F9E',
    fontSize: '12px',
    margin: theme.spacing(1, 0, 0, 0)
  }
}));

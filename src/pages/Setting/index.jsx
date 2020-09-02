import React, { useState } from 'react'

import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, Container, CssBaseline, Typography, Avatar,
  Paper, Button, TextField, InputAdornment, IconButton,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Slide
} from '@material-ui/core'

import { Visibility, VisibilityOff } from '@material-ui/icons'
import SettingsIcon from '@material-ui/icons/Settings'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'

import { makeStyles } from '@material-ui/core/styles'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function Settings({ history }) {
  const styles = useStyles()
  const [openDialog, setOpenDialog] = useState(false)
  const [openDialogDelete, setOpenDialogDelete] = useState(false)

  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false
  })

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword })
  }

  const handleMouseDownConfirmPassword = event => {
    event.preventDefault();
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleCloseDelete = () => {
    setOpenDialogDelete(false)
  }

  function handleAccept() {
    firebase.deleteUser()
  }

  function handleDelete() {
    setOpenDialogDelete(true)
  }

  function handleChangePassword() {
    setOpenDialogDelete(true)
    if (values.password === values.confirmPassword) {
      firebase.changePassword(values.password)
    } else {
      setOpenDialog(true)
    }
  }

  return (
    <React.Fragment>
      <div>
        <Dialog open={openDialog} onClose={handleClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              As senhas digitadas nos campos se diferem. Por favor digite novamente.
              </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>Ok</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDialogDelete} onClose={handleCloseDelete} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você realmente deseja deletar sua conta do Consulta Esperta?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAccept} color="primary" autoFocus>Sim</Button>
            <Button onClick={handleCloseDelete} color="secondary" autoFocus>Não</Button>
          </DialogActions>
        </Dialog>
      </div>
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
            <Container>
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
                  Visualize as principais definições de conta de usuário
                  que você cadastrou no sistema.
              </Typography>
              </Container>
            </Container>
          </Container>
          <main className={styles.layout}>
            <Paper elevation={3} className={styles.paper}>
              <Typography variant="h6" gutterBottom className={styles.title}>
                Definições da Conta
              </Typography>
              <Grid container direction="row">
                <Typography className={styles.typography} gutterBottom>Identificação: </Typography>
                <Typography gutterBottom>{firebase.getId()}</Typography>
                <Typography component="h6" color="textSecondary" gutterBottom>
                  Se você decidir que não quer mais usar os nossos serviços,
                  é possível deletar a sua conta do sistema clicando no botão abaixo.
                  </Typography>
              </Grid>
              <div className={styles.buttons}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  className={styles.button}
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
              </div>
              <Typography variant="h6" gutterBottom className={styles.title}>
                Alteração de senha
                       </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Senha"
                    type={values.showPassword ? 'text' : 'password'}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmar senha"
                    type={values.showConfirmPassword ? 'text' : 'password'}
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
              <div className={styles.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  className={styles.button}
                  onClick={handleChangePassword}
                >
                  Salvar
                </Button>
              </div>
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
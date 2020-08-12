import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'

import logo from '../../assets/simbolo-consulta.png'
import firebase from '../../config/Firebase'

import {
  Toolbar, Grid, IconButton, Typography, Link, Menu, MenuItem, Slide, Container,
  Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions
} from '@material-ui/core'
import { AccountCircle, /*Notifications*/ } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

function Header(props) {
  const styles = useStyles();

  const [openDialog, setOpenDialog] = useState(false)
  const [anchorUser, setAnchorUser] = useState(null)
  const openUser = Boolean(anchorUser)

  //const [anchorNotification, setAnchorNotification] = React.useState(null)
  //const openNotification = Boolean(anchorNotification)

  const handleUser = event => {
    setAnchorUser(event.currentTarget);
  }

  const handleCloseUser = () => {
    setAnchorUser(null);
  }

  /* const handleMenuNotification = event => {
       setAnchorNotification(event.currentTarget);
   } */

  /*const handleCloseNotification = () => {
    setAnchorNotification(null);
  } */

  async function handleLogout() {
    await firebase.logout()
    props.history.push('/')
  }

  function handleHome() {
    if (firebase.getId() !== null) {
      props.history.push('/home')
    } else {
      props.history.push('/')
    }
  }

  function handlePatient() {
    props.history.push('/patient')
  }

  function handleDoctor() {
    props.history.push('/doctor')
  }


  const handleClose = () => {
    setOpenDialog(false)
  };


  function handleProfile() {
    const userId = firebase.getId()
    var docRef = firebase.db.collection("users").doc(userId)
    docRef.get().then(doc => {
      if (doc.exists) {
        props.history.push('/profile')
      } else {
        setOpenDialog(true)
      }
    })
  }

  function handleSchedule() {
    props.history.push('/schedule')
  }

  function handleLogin() {
    props.history.push('/login')
  }


  return (
    <React.Fragment>
      <div>
        <Dialog open={openDialog} onClose={handleClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Criação de perfil</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Precisamos que você nos informe o seu tipo de usuário. Selecione abaixo se você é um médico ou um paciente.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDoctor} color="secondary" autoFocus>Médico</Button>
            <Button onClick={handlePatient} color="primary" autoFocus>Paciente</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Toolbar className={styles.toolbar}>
        <img src={logo} alt="Consulta Esperta" height="26em" className={styles.img} onClick={handleHome} />
        <Grid>
          {/*<IconButton
                        aria-label="account of current user"
                        aria-controls="menu-account"
                        aria-haspopup="true"
                        onClick={handleMenuNotification}
                        color="inherit"
                        size="medium"
                    >
                        <Badge color="secondary" variant="dot">
                            <Notifications color='inherit' />
                        </Badge>
                    </IconButton> 
          <Menu
            id="menu-account"
            anchorEl={anchorNotification}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={openNotification}
            onClose={handleCloseNotification}
          >
            <Typography color="textSecondary" className={styles.user}>
              Você tem uma nova consulta
            </Typography>
            <MenuItem>Confirmar</MenuItem>
          </Menu> */}
          {firebase.getId() !== null ? (
            <React.Fragment>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-account"
                aria-haspopup="true"
                onClick={handleUser}
                color="inherit"
                size="medium"
              >
                <AccountCircle color='inherit' />
              </IconButton>
              <Menu
                id="menu-account"
                anchorEl={anchorUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openUser}
                onClose={handleCloseUser}
              >
                <Typography color="textSecondary" className={styles.user}>{firebase.getUsername()}</Typography>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </React.Fragment>
          ) : (
              <Button variant="outlined" color="default" onClick={handleLogin} size="small">
                Entrar
              </Button>
            )}
        </Grid>
      </Toolbar>
      <Container maxWidth="sm">
        {firebase.getId() !== null && (
          <Toolbar component="nav" variant="dense" className={styles.toolbarSecondary}>
            <Link
              color="inherit"
              noWrap
              variant="body2"
              onClick={handleHome}
              className={styles.toolbarLink}
            >
              Início
            </Link>
            <Link
              color="inherit"
              noWrap
              variant="body2"
              onClick={handleProfile}
              className={styles.toolbarLink}
            >
              Perfil
            </Link>
            <Link
              color="inherit"
              noWrap
              variant="body2"
              onClick={handleSchedule}
              className={styles.toolbarLink}
            >
              Agenda
            </Link>
            <Link
              color="inherit"
              noWrap
              variant="body2"
              onClick={handleSchedule}
              className={styles.toolbarLink}
            >
              Sugestões
            </Link>
            <Link
              color="inherit"
              noWrap
              variant="body2"
              onClick={handleSchedule}
              className={styles.toolbarLink}
            >
              Avaliações
            </Link>
          </Toolbar>
        )}
      </Container>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  img: {
    cursor: 'pointer'
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    flex: 1,
    justifyContent: 'space-between'
  },
  toolbarTitle: {
    justifyContent: 'flex-start'
  },
  toolbarButton: {
    justifyContent: 'flex-end'
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(0, 2, 0, 2),
    flexShrink: 0,
    cursor: 'pointer'

  },
  user: {
    padding: theme.spacing(1, 2, 1, 2)
  },
}));

export default withRouter(Header)
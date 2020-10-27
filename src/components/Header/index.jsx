import React, { useState } from 'react'
import { withRouter, useLocation } from 'react-router-dom'

import logo from '../../assets/simbolo-consulta.png'
import firebase from '../../config/Firebase'

import {
  Toolbar, Grid, IconButton, Typography, Link, Menu, MenuItem, Slide, Container,
  Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions,
  ListItemIcon, Badge
} from '@material-ui/core'
import { AccountCircle, ExitToApp, Person, Settings, VpnKey, ArrowBack, Notifications } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

function Header(props) {
  const styles = useStyles()
  let location = useLocation()

  const [openDialog, setOpenDialog] = useState(false)
  const [anchorUser, setAnchorUser] = useState(null)
  const openUser = Boolean(anchorUser)

  const [anchorNotification, setAnchorNotification] = React.useState(null)
  const openNotification = Boolean(anchorNotification)

  const handleUser = event => {
    setAnchorUser(event.currentTarget);
  }

  const handleCloseUser = () => {
    setAnchorUser(null);
  }

  const handleMenuNotification = event => {
    setAnchorNotification(event.currentTarget);
  }

  const handleCloseNotification = () => {
    setAnchorNotification(null);
  }

  async function handleLogout() {
    await firebase.logout()
    props.history.push('/')
  }

  function handleSettings() {
    props.history.push('/setting')
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
  }

  function renderMainButton() {
    if (location.pathname === '/') {
      return (
        <Button variant="outlined" color="default" onClick={handleLogin} size="small" startIcon={<VpnKey />}>
          Entrar
        </Button>
      )
    } else if (location.pathname === '/login') {
      return (
        <Button variant="outlined" color="default" onClick={handleBack} size="small" startIcon={<ArrowBack />}>
          Voltar
        </Button>
      )
    }
  }

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

  function handleRating() {
    props.history.push('/rating')
  }

  function handleLogin() {
    props.history.push('/login')
  }

  function handleBack() {
    props.history.push('/')
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
        <img src={logo} alt="Consulta Esperta" height="28em" className={styles.img} onClick={handleHome} />
        <Grid>
          {firebase.getId() !== null && (
            <React.Fragment>

              <IconButton
                aria-label="account of current user"
                aria-controls="menu-account"
                aria-haspopup="true"
                onClick={handleMenuNotification}
                color="inherit"
                size="medium"
              ><Badge badgeContent={0} color="error" children={<Notifications />}>
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
                <MenuItem disabled>Sem notificações</MenuItem>
              </Menu>
            </React.Fragment>
          )}
          {renderMainButton()}
          {firebase.getId() !== null && (
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
                <MenuItem onClick={handleLogout} className={styles.user} disabled >
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <Typography>
                    {firebase.getUsername()}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleSettings}>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <Typography>Ajustes</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToApp />
                  </ListItemIcon>
                  <Typography>Sair</Typography>
                </MenuItem>
              </Menu>
            </React.Fragment>
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
              Consultas
            </Link>
            <Link
              color="inherit"
              noWrap
              variant="body2"
              onClick={handleRating}
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
    marginBottom: 10
  }
}))

export default withRouter(Header)
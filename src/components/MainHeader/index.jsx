import React from 'react'
import { withRouter } from 'react-router-dom'

import logo from '../../assets/simbolo-consulta.png'

import { Toolbar, Grid, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

function Header(props) {
  const styles = useStyles();

  function handleMain() {
    props.history.push('/')
  }

  function handleLogin() {
    props.history.push('/login')
  }

  return (
    <React.Fragment>
      <Toolbar className={styles.toolbar}>
        <img src={logo} alt="Consulta Esperta" height="26em" className={styles.img} onClick={handleMain} />
        <Grid>
          <Button variant="outlined" color="default" onClick={handleLogin} size="small">
            Entrar
          </Button>
        </Grid>
      </Toolbar>

    </React.Fragment>
  );
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
    justifyContent: 'center',
  },
  toolbarLink: {
    padding: theme.spacing(0, 4, 0, 4),
    cursor: 'pointer'
  },
  user: {
    padding: theme.spacing(1, 2, 1, 2)
  },
}));

export default withRouter(Header)
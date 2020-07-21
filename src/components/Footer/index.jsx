import React from 'react'
import logo from '../../assets/logo-consulta.png'
import Copyright from '../Copyright'

import { Container, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

export default function Footer() {
  const styles = useStyles();

  return (
    <footer className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center" justify="center">
          <img src={logo} alt="Consulta Esperta" height="50em" />
          <Typography variant="subtitle1" component="p">
            Desenvolvido em Belo Horizonte
          </Typography>
          <Copyright />
        </Grid>
      </Container>
    </footer>
  );
}

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: '#232e33',
    padding: theme.spacing(6, 0),
    color: '#fdfdfd'
  }
}));

import React from 'react'

import {
  Grid, Container, CssBaseline, Typography, Avatar
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

import { Bookmarks } from '@material-ui/icons'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { makeStyles } from '@material-ui/core/styles'

export default function Suggestion({ history }) {
  const styles = useStyles()
  return (
    <React.Fragment>
      <Grid container className={styles.mainGrid} direction="column">
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <Header />
          </Container>
          <Container maxWidth="sm" component="main" className={styles.mainContainer}>
            <Avatar className={styles.avatar}>
              <Bookmarks />
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
                Minhas sugestões
            </Typography>
              <Typography
                component="h5"
                variant="h6"
                align="center"
                color="textSecondary"
                gutterBottom
              >
                Informe seus sintomas e nós recomendaremos um
                médico especializado para você.
              </Typography>
            </Container>
          </Container>
          <Container maxWidth="md" className={styles.alert}>
            <Alert severity="warning" variant="standard" elevation={3}>
              <AlertTitle>Atenção</AlertTitle>
                  Essa funcionalidade ainda está em desenvolvimento.
                  Avisaremos quando estiver disponível!
                </Alert>
          </Container>
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  mainGrid: {
    backgroundColor: '#F5FFFA',
    minHeight: '100vh'
  },
  mainContainer: {
    padding: theme.spacing(6, 0, 6),
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  resultTypography: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    fontWeight: 'bold'
  },
  mainTitle: {
    fontWeight: 'bold',
    color: '#322153',
    fontFamily: 'Ubuntu',
  },
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },
  alert: {
    marginBottom: theme.spacing(4)
  },
  title: {
    fontSize: 14,
  },
  information: {
    marginBottom: 12,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  gridChip: {
    display: 'flex',
    justifyContent: 'center'
  },
  chip: {
    marginRight: 10
  }
}))
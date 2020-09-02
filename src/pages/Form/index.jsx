import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, Container, CssBaseline, Typography, Avatar, Accordion,
  CircularProgress, AccordionSummary,
  //AccordionActions,AccordionDetails
} from '@material-ui/core'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CommentIcon from '@material-ui/icons/Comment'

import { makeStyles } from '@material-ui/core/styles'

export default function Form({ history }) {
  const styles = useStyles()
  const { idDoctor } = useLocation()

  if (idDoctor !== undefined) {
    localStorage.setItem('id', idDoctor)
  }

  const [fetchData, setFetchData] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    firebase.db.collection('doctors').doc(localStorage.getItem('id')).get().then(function (doc) {
      if (doc.exists) {
        const { name, description } = doc.data()
        setName(name)
        setDescription(description)
        setFetchData(true)
      }
    })
  })

  return fetchData === true ? (
    <React.Fragment>
      <Grid container className={styles.mainGrid}>
        <Container>
          <Grid container direction="column">
            <CssBaseline />
            <Container component="main" maxWidth="lg">
              <Header />
            </Container>
            <Container maxWidth="sm" component="main" className={styles.mainContainer}>
              <Avatar className={styles.avatar}>
                <CommentIcon />
              </Avatar>
              <Typography
                className={styles.mainTitle}
                component="h2"
                variant="h3"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                {name}
              </Typography>
              <Container maxWidth="sm">
                <Typography
                  component="h5"
                  variant="h6"
                  align="center"
                  color="textSecondary"
                >
                  {description}
                </Typography>
              </Container>
            </Container>
            <Container className={styles.cardGrid} maxWidth="md">
              <React.Fragment>
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                  >
                    <Typography className={styles.heading}>Médico</Typography>
                    <Typography className={styles.secondaryHeading}>Avalie o médico consultado</Typography>
                  </AccordionSummary>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                  >
                    <Typography className={styles.heading}>Local</Typography>
                    <Typography className={styles.secondaryHeading}>Avalie o local de atendimento</Typography>
                  </AccordionSummary>
                </Accordion>
              </React.Fragment>
            </Container>
          </Grid>
        </Container>
      </Grid>
      <Footer />
    </React.Fragment>
  ) : <div id="loader"><CircularProgress /></div>
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
}))
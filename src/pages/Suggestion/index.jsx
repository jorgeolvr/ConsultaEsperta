import React, { useState, useEffect } from 'react'

import {
  Grid, Container, CssBaseline, Typography, Avatar, Accordion, AccordionSummary,
  AccordionDetails, Chip, Box, Paper, CircularProgress
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

import firebase from '../../config/Firebase'

import { Bookmarks, ExpandMore } from '@material-ui/icons'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { makeStyles } from '@material-ui/core/styles'

export default function Suggestion({ history }) {
  const styles = useStyles()
  let selected = []

  const [fetchData, setFetchData] = useState(false)
  const [symptoms, setSymptoms] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])

  useEffect(() => {
    firebase.db.collection('symptoms').orderBy("name").get().then(snapshot => {
      if (snapshot) {
        let symptoms = []
        snapshot.forEach(symptom => {
          symptoms.push({
            key: symptom.id,
            ...symptom.data()
          })
        })
        setSymptoms(symptoms)
        setFetchData(true)
      }
    })
  })

  function handleSymptom(name) {

  }

  return fetchData === true ? (
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
                Encontre a especialidade médica ideal e sugerida por meio dos seus sintomas sentidos.
              </Typography>
            </Container>
          </Container>
          <Container className={styles.cardGrid} maxWidth="md">
            <Accordion defaultExpanded elevation={3}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1c-content"
                id="panel1c-header"
              >
                <Typography className={styles.heading}>Sugestão baseada em sintomas</Typography>
                <Typography className={styles.secondaryHeading}>Selecione abaixo pelo menos três sintomas</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  {symptoms.map(symptom => (
                    <Grid item key={symptom.key} className={styles.chip} sm={3} xs={12}>
                      <Chip label={symptom.name} variant="outlined" color="primary" onClick={() => handleSymptom(symptom.name)} />
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
            {/*<Paper component="ul" className={styles.paper}>
              {selectedSymptoms.map((data) => {
                return (
                  <li key={data}>
                    <Chip

                      label={data}

                    />
                  </li>
                );
              })}
            </Paper>*/}
          </Container>
        </Grid>
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
    marginBottom: 10
  },
  paper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  }
}))
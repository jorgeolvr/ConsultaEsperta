import React, { useState, useEffect } from 'react'

import {
  Grid, Container, CssBaseline, Typography, Avatar, Accordion, AccordionSummary,
  AccordionDetails, Chip, CircularProgress, AccordionActions, Button, Divider,
  Snackbar
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import firebase from '../../config/Firebase'

import { Bookmarks, ExpandMore } from '@material-ui/icons'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { makeStyles } from '@material-ui/core/styles'

export default function Suggestion({ history }) {
  const styles = useStyles()

  const [fetchData, setFetchData] = useState(false)
  const [open, setOpen] = useState(false)
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

  const handleSymptom = (name) => {
    let selected = selectedSymptoms

    if (selectedSymptoms.length < 6 && !selected.includes(name)) {
      selected.push(name)
      setSelectedSymptoms(selected)
      setOpen(true)
    }
  }


  const handleDeleteSymptom = (name) => {
    setSelectedSymptoms((symptoms) => selectedSymptoms.filter((symptom) => symptom !== name))
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false)
  }

  function handleResult() {

  }

  return fetchData === true ? (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={open}
        onClose={handleClose}
        autoHideDuration={1000}
      >
        <Alert severity="info" onClose={handleClose} elevation={3}>
          Sintoma adicionado na sua lista
        </Alert>
      </Snackbar>
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
            <Accordion elevation={3}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1c-content"
                id="panel1c-header"
              >
                <Typography className={styles.heading}>Lista de sintomas</Typography>
                <Typography className={styles.secondaryHeading}>Selecione de três a seis sintomas</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  {symptoms.map(symptom => (
                    <Grid item key={symptom.key} className={styles.chip} sm={3} xs={12}>
                      <Chip label={symptom.name} variant="outlined" onClick={() => handleSymptom(symptom.name)} />
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion elevation={3}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1c-content"
                id="panel1c-header"
              >
                <Typography className={styles.heading}>Meus sintomas</Typography>
                <Typography className={styles.secondaryHeading}>Confira os sintomas selecionados</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  {selectedSymptoms.map((symptom) => (
                    <Grid item key={symptom.key} className={styles.chip} sm={3} xs={12}>
                      <Chip
                        label={symptom}
                        onDelete={() => handleDeleteSymptom(symptom)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
              <Divider />
              <AccordionActions>
                <Button color="primary" onClick={handleResult}>Ver sugestão</Button>
              </AccordionActions>
            </Accordion>
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
  selection: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  }
}))
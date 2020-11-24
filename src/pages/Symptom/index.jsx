import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'
import axios from 'axios'

import {
  Grid, Container, CssBaseline, Typography, Avatar, CircularProgress, Button,
  Paper, Stepper, Step, StepLabel, TextField, StepContent, Slide, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import firebase from '../../config/Firebase'

import { Bookmarks, CheckCircle, Search } from '@material-ui/icons'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { makeStyles } from '@material-ui/core/styles'

function getSteps() {
  return ['Selecione o seu estado', 'Selecione a sua cidade', 'Escolha os sintomas']
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function Symptom({ history }) {
  const styles = useStyles()
  const steps = getSteps()

  const {
    globalLocation, setGlobalLocation, selectedSymptoms, setSelectedSymptoms,
    selectedHomeUf, setSelectedHomeUf
  } = useContext(Context)

  const [ufs, setUfs] = useState([])
  const [fetchData, setFetchData] = useState(false)
  const [open, setOpen] = useState(false)
  const [cities, setCities] = useState([])
  const [symptoms, setSymptoms] = useState([])
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
      const states = res.data.map(uf => uf = { 'initial': `${uf.sigla}`, 'name': `${uf.nome}` })
      setUfs(states)
    })
  }, [])

  useEffect(() => {
    if (selectedHomeUf !== null) {
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedHomeUf.initial}/municipios`).then(res => {
        const cityNames = res.data.map(city => city.nome)
        setCities(cityNames)
      })
    } else {
      setCities([])
    }
  }, [selectedHomeUf])

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
        const symptomsNames = symptoms.map(symptom => symptom.name)
        setSymptoms(symptomsNames)
        setFetchData(true)
      }
    })
  }, [])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleReset = () => {
    setGlobalLocation("")
    setSelectedSymptoms([])
    setActiveStep(0);
  }


  function handleResult() {
    if (selectedSymptoms.length < 3 || globalLocation === "") {
      setOpen(true)
    } else {
      localStorage.removeItem("location")
      localStorage.removeItem("diseaseName")
      localStorage.removeItem("localSpeciality")
      history.push("/result")
    }
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <React.Fragment>
            <Autocomplete
              fullWidth
              options={ufs}
              getOptionLabel={uf => uf.name}
              renderOption={(option) => (
                <React.Fragment>
                  {option.name}
                </React.Fragment>
              )}
              value={selectedHomeUf}
              onChange={(event, newValue) => {
                setSelectedHomeUf(newValue)
                setGlobalLocation("")
              }}
              renderInput={(params) => <TextField {...params} label="Estados" variant="standard" />}
            />
          </React.Fragment>
        )
      case 1:
        return (
          <React.Fragment>
            <Autocomplete
              fullWidth
              options={cities}
              getOptionLabel={cities => cities}
              value={globalLocation}
              disabled={selectedHomeUf === null || selectedHomeUf.length === 0}
              onChange={(event, newValue) => {
                setGlobalLocation(newValue)
              }}
              renderInput={(params) => <TextField {...params} label="Cidades" variant="standard" />}
            />
          </React.Fragment>
        )
      case 2:
        return (
          <React.Fragment>
            <Autocomplete
              fullWidth
              multiple
              filterSelectedOptions
              limitTags={3}
              size="small"
              options={symptoms}
              getOptionLabel={symptoms => symptoms}
              value={selectedSymptoms}
              onChange={(event, newValue) => {
                if (selectedSymptoms.length < 10) {
                  setSelectedSymptoms(newValue)
                }
              }}

              renderInput={(params) => <TextField {...params} label="Sintomas" variant="standard" />}
            />
          </React.Fragment>
        )

      default:
        return 'Unknown step';
    }
  }

  return fetchData === true ? (
    <React.Fragment>
      <div>
        <Dialog open={open} onClose={handleClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Para utilizar e continuar a busca recomendada você precisa selecionar seu estado, sua cidade,
              pelo menos três e no máximo dez sintomas.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
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
                Recomendação baseada em sintomas
              </Typography>
              <Typography
                component="h5"
                variant="h6"
                align="center"
                color="textSecondary"
                gutterBottom
              >
                Encontre o médico ideal e um diagnóstico prévio por meio do relato dos seus sintomas.
              </Typography>
            </Container>
          </Container>
          <main className={styles.layout}>
            <Paper elevation={3} className={styles.paper}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      <Typography>{getStepContent(index)}</Typography>
                      <div className={styles.actionsContainer}>
                        <div className={styles.buttons}>
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            className={styles.firstButton}
                          >
                            Voltar
                        </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={styles.secondButton}
                            startIcon={<CheckCircle />}
                          >
                            Continuar
                        </Button>
                        </div>
                      </div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0} className={styles.resetContainer}>
                  <div className={styles.buttons}>
                    <Button onClick={handleReset} className={styles.firstButton}>
                      Recomeçar
                  </Button>
                    <Button
                      onClick={handleResult}
                      color="primary"
                      variant="contained"
                      className={styles.secondButton}
                      startIcon={<Search />}
                    >
                      Buscar
                  </Button>
                  </div>
                </Paper>
              )}
            </Paper>
          </main>
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment>
  ) : <div id="loader"><CircularProgress /></div>
}

const useStyles = makeStyles(theme => ({
  mainGrid: {
    backgroundColor: '#F5FFFA',
    minHeight: '100vh',
  },
  mainTitle: {
    fontWeight: 'bold',
    color: '#322153',
    fontFamily: 'Ubuntu',
  },
  secondaryTitle: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(3)
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
  paper: {
    marginBottom: theme.spacing(8),
  },
  firstButton: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  secondButton: {
    marginTop: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  mainContainer: {
    padding: theme.spacing(6, 0, 6),
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  typography: {
    fontWeight: 'bold',
    marginRight: 5
  },
  title: {
    marginTop: theme.spacing(2),
    fontWeight: 'bold'
  },
  userAlert: {
    marginBottom: 20
  }
}))
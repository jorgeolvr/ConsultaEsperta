import React, { useState } from 'react'

import {
  Grid, Container, CssBaseline, Typography, Button, TextField, Avatar, FormControl,
  Paper, Stepper, Step, StepLabel, StepContent, InputLabel, Select, MenuItem
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import EventAvailableIcon from '@material-ui/icons/EventAvailable'
import { makeStyles } from '@material-ui/core/styles'


//import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

function getSteps() {
  return ['Selecione o dia', 'Digite um preço ', 'Digite um horário', 'Selecione a duração']
}

export default function Create() {
  const styles = useStyles()
  const steps = getSteps()

  const [activeStep, setActiveStep] = useState(0)

  const [day, setDay] = useState('')
  const [selectedUf, setSelectedUf] = useState('')
  const [cities, setCities] = useState([])
  const [specialities, setSpecialities] = useState([])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const handleReset = () => {
    setActiveStep(0);
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <React.Fragment>
            <FormControl fullWidth>
              <InputLabel>Dias da semana</InputLabel>
              <Select
                value={day}
                label="Dia da semana"
                onChange={event => setDay(event.target.value)}

              >
                <MenuItem value="Segunda-feira">Segunda-feira</MenuItem>
                <MenuItem value="Terça-feira">Terça-feira</MenuItem>
                <MenuItem value="Quarta-feira">Quarta-feira</MenuItem>
                <MenuItem value="Quinta-feira">Quinta-feira</MenuItem>
                <MenuItem value="Sexta-feira">Sexta-feira</MenuItem>
              </Select>
            </FormControl>
          </React.Fragment>
        )
      case 1:
        return (
          <React.Fragment>
            <Autocomplete
              fullWidth
              options={cities}
              getOptionLabel={cities => cities}
              value={day}
              disabled={selectedUf === ""}
              onChange={(event, newValue) => {
                setDay(newValue)
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
              options={specialities}
              getOptionLabel={specialities => specialities}
              value={day}
              onChange={(event, newValue) => {
                setDay(newValue)
              }}
              renderInput={(params) => <TextField {...params} label="Especialidades" variant="standard" />}
            />
          </React.Fragment>
        )
      case 3:
        return (
          <React.Fragment>
            <Autocomplete
              fullWidth
              options={specialities}
              getOptionLabel={specialities => specialities}
              value={day}
              onChange={(event, newValue) => {
                setDay(newValue)
              }}
              renderInput={(params) => <TextField {...params} label="Especialidades" variant="standard" />}
            />
          </React.Fragment>
        )

      default:
        return 'Unknown step';
    }
  }

  return (
    <React.Fragment>
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <Header />
          </Container>
          <Container maxWidth="sm" component="main" className={styles.mainContainer}>
            <Avatar className={styles.avatar}>
              <EventAvailableIcon />
            </Avatar>
            <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" gutterBottom>
              Criar consultas
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" component="p">
              Cadastre os dias de seu atendimento informando o preço, horário de duração da consulta.
        </Typography>
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
                      Cadastrar novo
                    </Button>
                    <Button

                      color="primary"
                      variant="contained"
                      className={styles.secondButton}
                    >
                      Finalizar
              </Button>
                  </div>
                </Paper>
              )}
            </Paper>
          </main>
        </Grid>
      </Grid >
      <Footer />
    </React.Fragment>
  )
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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));
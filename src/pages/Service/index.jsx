import React, { useState, useContext } from 'react'
import { Context } from '../../Context'

import {
  Grid, Container, CssBaseline, Typography, Button,
  Paper, Stepper, Step, StepLabel, Avatar, Dialog, DialogContent,
  DialogContentText, DialogActions, Slide, DialogTitle
} from '@material-ui/core'

import firebase from '../../config/Firebase'

import EventAvailableIcon from '@material-ui/icons/EventAvailable'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import SaveIcon from '@material-ui/icons/Save'

import { makeStyles } from '@material-ui/core/styles'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DoctorServiceData from '../../components/DoctorServiceData'
import DoctorServiceDetail from '../../components/DoctorServiceDetail'
import DoctorServiceReview from '../../components/DoctorServiceReview'

const steps = ['Dados de atendimento', 'Detalhes de atendimento', 'Revisar dados'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <DoctorServiceData />
    case 1:
      return <DoctorServiceDetail />
    case 2:
      return <DoctorServiceReview />
    default:
      throw new Error('Unknown step')
  }
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function Service({ history }) {
  const styles = useStyles()

  const {
    day, checked, price, duration, interval,
    beginHour, endHour,
  } = useContext(Context)

  const [openDialog, setOpenDialog] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleNext = () => {
    if (activeStep === 0 && (day === "" || price === "")) {
      setOpenDialog(true)
    } else if (activeStep === 1 && (duration === 0)) {
      setOpenDialog(true)
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  function handleMain() {
    history.push('/home')
  }

  const handleService = () => {
    var period = duration + interval //Intervalo em minutos
    var times = [] //Array de horários

    var begin = beginHour.format('LT').split(":")[0] //Hora de início
    if (begin.includes("00") || begin.includes("01") || begin.includes("02") || begin.includes("03") ||
      begin.includes("04") || begin.includes("05") || begin.includes("06") || begin.includes("07") ||
      begin.includes("08") || begin.includes("09")) {
      begin = begin.split("0")[1]
    }

    var end = endHour.format('LT').split(":")[0] //Hora de término
    if (begin.includes("00") || begin.includes("01") || begin.includes("02") || begin.includes("03") ||
      begin.includes("04") || begin.includes("05") || begin.includes("06") || begin.includes("07") ||
      begin.includes("08") || begin.includes("09")) {
      end = end.split("0")[1]
    }

    var incrementer = 0 //Incrementador de minutos
    var j = 0; //Contador de posição do array
    var ordenation = ''

    //Loop para incrementar o tempo e colocar o resultado no array
    for (var i = begin;incrementer < end * 60;i++) {
      var hour = Math.floor(incrementer / 60); // Gerar horas no formato 0-24

      var minute = (incrementer % 60); // Gerar minutos de uma hora no formato 0-60
      if (hour >= begin) {
        times[j] = ("0" + hour).slice(-2) + ':' + ("0" + minute).slice(-2);
        j++;
      }
      incrementer = incrementer + period;
    }

    if (day === 'Segunda-feira') {
      ordenation = 1
    } else if (day === 'Terça-feira') {
      ordenation = 2
    } else if (day === 'Quarta-feira') {
      ordenation = 3
    } else if (day === 'Quinta-feira') {
      ordenation = 4
    } else if (day === 'Sexta-feira') {
      ordenation = 5
    }

    setActiveStep(activeStep + 1)

    if (checked === true) {
      firebase.db.collection('doctors').doc(firebase.getId()).update({
        price: price
      })

      firebase.db.collection('doctors').doc(firebase.getId()).collection('schedules').doc().set({
        ordenation: ordenation,
        begin: beginHour.format('LT'),
        day: day,
        duration: duration,
        end: endHour.format('LT'),
        interval: interval,
        times: times
      })
    } else if (checked === false) {
      firebase.db.collection('doctors').doc(firebase.getId()).update({
        price: 'Individual'
      })

      firebase.db.collection('doctors').doc(firebase.getId()).collection('schedules').doc().set({
        ordenation: ordenation,
        begin: beginHour.format('LT'),
        day: day,
        duration: duration,
        end: endHour.format('LT'),
        interval: interval,
        price: price,
        times: times
      })
    }
  }

  return (
    <React.Fragment>
      <div>
        <Dialog open={openDialog} onClose={handleClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              É necessário preencher todos os campos para continuar.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
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
            <Container>
              <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" gutterBottom>
                Meu atendimento
            </Typography>
              <Typography component="h5" variant="h6" align="center" color="textSecondary">
                Cadastre a sua disponibilidade informando o dia, preço, duração e intervalos de consulta.
        </Typography>
            </Container>
          </Container>
          <main className={styles.layout}>
            <Paper elevation={3} className={styles.paper}>
              <Stepper activeStep={activeStep} className={styles.stepper}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <React.Fragment>
                {activeStep === steps.length ? (
                  <React.Fragment>
                    <Typography variant="h5" gutterBottom>
                      Obrigado por cadastrar seu atendimento.
                    </Typography>
                    <Typography variant="subtitle1">
                      Se quiser adicionar um novo atendimento, volte aqui e conclua esse processo novamente.
                    </Typography>
                    <div className={styles.buttons}>
                      <Button variant="contained" color="primary" onClick={handleMain} className={styles.button}>
                        Ok
                      </Button>
                    </div>
                  </React.Fragment>
                ) : (
                    <React.Fragment>
                      {getStepContent(activeStep)}
                      <div className={styles.buttons}>
                        {activeStep !== 0 && (
                          <Button onClick={handleBack} className={styles.button}>
                            Voltar
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={activeStep === steps.length - 1 ? handleService : handleNext}
                          className={styles.button}
                          startIcon={activeStep === steps.length - 1 ? <SaveIcon /> : <ArrowForwardIcon />}
                        >
                          {activeStep === steps.length - 1 ? 'Salvar' : 'Avançar'}
                        </Button>
                      </div>
                    </React.Fragment>
                  )}
              </React.Fragment>
            </Paper>
          </main>
        </Grid>
      </Grid >
      <Footer />
    </React.Fragment>
  )
}


const useStyles = makeStyles(theme => ({
  /*mainGrid: {
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
  }, */
  mainGrid: {
    minHeight: '100vh',
    backgroundColor: '#F5FFFA'
  },
  mainContainer: {
    padding: theme.spacing(6, 0, 6),
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
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
  mainTitle: {
    fontWeight: 'bold',
    color: '#322153',
    fontFamily: 'Ubuntu',
  },
  paper: {
    marginBottom: theme.spacing(8),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  }
}));
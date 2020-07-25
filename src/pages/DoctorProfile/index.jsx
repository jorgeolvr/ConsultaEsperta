import React, { useContext, useState } from 'react'
import { Context } from '../../Context'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DoctorInformation from '../../components/DoctorInformation'
import ScheduleInformation from '../../components/ScheduleInformation'
import DoctorReview from '../../components/DoctorReview'

import firebase from '../../config/Firebase'

import {
  Grid, Container, CssBaseline, Typography, Paper, Stepper, Step, StepLabel, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide, Avatar
} from '@material-ui/core'
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar'
import { makeStyles } from '@material-ui/core/styles'

const steps = ['Dados pessoais', 'Dados de consulta', 'Revisar dados'];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

function getStepContent(step) {
  switch (step) {
    case 0:
      return <DoctorInformation />
    case 1:
      return <ScheduleInformation />
    case 2:
      return <DoctorReview />
    default:
      throw new Error('Unknown step')
  }
}

export default function DoctorProfile({ history }) {
  const styles = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const [open, setOpen] = useState(false)

  const name = firebase.getUsername()
  const email = firebase.getEmail()

  const {
    crm, cpf, phone, description, speciality, city, street, streetNumber, neighbour,
  } = useContext(Context)

  function handleMain() {
    history.push('/home')
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    if (activeStep === 0 && (crm === "" || cpf === "" || phone === "")) {
      setOpen(true)
    } else if (activeStep === 1 && (description === "")) {
      setOpen(true)
    }
    else {
      setActiveStep(activeStep + 1);
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  }

  const handleProfile = () => {
    setActiveStep(activeStep + 1);
    firebase.userDatabase(name, email, cpf, phone, 'Médico')
    firebase.doctorDatabase(name, crm, description, city, speciality, street, streetNumber, neighbour)
  }

  return (
    <React.Fragment>
      <div>
        <Dialog open={open} onClose={handleClose} keepMounted TransitionComponent={Transition}>
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
              <PermContactCalendarIcon />
            </Avatar>
            <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
              Meu perfil
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" component="p">
              Preencha os campos com seus dados pessoais e forma de pagamento para manter o perfil atualizado.
            </Typography>
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
                      Obrigado por completar seu perfil.
                    </Typography>
                    <Typography variant="subtitle1">
                      Volte para a tela principal e comece a usar.
                      Se quiser mudar seu perfil, volte aqui e conclua esse processo novamente.
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
                          onClick={activeStep === steps.length - 1 ? handleProfile : handleNext}
                          className={styles.button}
                        >
                          {activeStep === steps.length - 1 ? 'Salvar Dados' : 'Avançar'}
                        </Button>
                      </div>
                    </React.Fragment>
                  )}
              </React.Fragment>
            </Paper>
          </main>
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
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
    fontWeight: 'bold'
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
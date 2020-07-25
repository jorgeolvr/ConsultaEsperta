import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../../Context'
import axios from 'axios'

import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, Container, CssBaseline, Typography, Button, TextField, Avatar,
  Paper, Stepper, Step, StepLabel, StepContent, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Slide, CircularProgress
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import AssistantIcon from '@material-ui/icons/Assistant'
import { makeStyles } from '@material-ui/core/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

function getSteps() {
  return ['Selecione o seu estado', 'Selecione a sua cidade', 'Escolha a especialidade']
}

export default function Home({ history }) {
  const styles = useStyles();
  const steps = getSteps();

  const {
    globalLocation, setGlobalLocation, globalSpeciality, setGlobalSpeciality
  } = useContext(Context)

  const [openDialog, setOpenDialog] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [fetchData, setFetchData] = useState(false)

  const [userType, setUserType] = useState('')
  const [ufs, setUfs] = useState([])
  const [selectedUf, setSelectedUf] = useState('')
  const [cities, setCities] = useState([])
  const [specialities, setSpecialities] = useState([])

  if (!firebase.getUsername()) {
    alert("Você foi desconectado. Faça login novamente.")
    history.push('/')
  }

  function handleSearch() {
    if (globalLocation === "" || globalSpeciality === "") {
      setOpenDialog(true)
    } else {
      history.push('/search')
    }
  }

  const handleClose = () => {
    setOpenDialog(false)
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setGlobalLocation("")
    setGlobalSpeciality("")
    setActiveStep(0);
  };

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
      //const states = res.data.map(uf => new Object({ 'initial': `${uf.sigla}`, 'name': `${uf.nome}` }))
      const states = res.data.map(uf => uf.sigla)
      setUfs(states)
    })
  }, [])

  useEffect(() => {
    // Carregar as cidades sempre que a UF mudar
    if (selectedUf === '0') {
      return
    }

    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(res => {
      const cityNames = res.data.map(city => city.nome)

      setCities(cityNames)
    })

  }, [selectedUf])

  useEffect(() => {
    firebase.db.collection("specialities").orderBy("name")
      .get().then(snapshot => {
        if (snapshot) {
          let specialities = []
          snapshot.forEach(speciality => {
            specialities.push({
              ...speciality.data()
            })
          })
          const specialityNames = specialities.map(speciality => speciality.name)
          setSpecialities(specialityNames)
        }
      })
  }, [])

  useEffect(() => {
    firebase.db.collection("users").doc(firebase.getId()).get().then(doc => {
      if (doc.exists) {
        const { type } = doc.data()
        setUserType(type)
        setFetchData(true)
      } else {
        setUserType("New User")
        setFetchData(true)
      }
    })
  })

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <React.Fragment>
            <Autocomplete
              fullWidth
              options={ufs}
              getOptionLabel={uf => uf}
              value={selectedUf}
              onChange={(event, newValue) => {
                setSelectedUf(newValue)
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
              disabled={selectedUf === ""}
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
              options={specialities}
              getOptionLabel={specialities => specialities}
              value={globalSpeciality}
              onChange={(event, newValue) => {
                setGlobalSpeciality(newValue)
              }}
              renderInput={(params) => <TextField {...params} label="Especialidades" variant="standard" />}
            />
          </React.Fragment>
        )

      default:
        return 'Unknown step';
    }
  }

  function patientComponent() {
    return (
      <React.Fragment>
        <Container maxWidth="sm" component="main" className={styles.mainContainer}>
          <Avatar className={styles.avatar}>
            <AssistantIcon />
          </Avatar>
          <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
            Reinvente o seu jeito de agendar consultas
            </Typography>
          <Typography variant="h5" align="center" color="textSecondary" component="p">
            Busque profissionais por especialidade, localização,
            preço e qualidade de atendimento.
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
                    Recomeçar
                  </Button>
                  <Button
                    onClick={handleSearch}
                    color="primary"
                    variant="contained"
                    className={styles.secondButton}
                  >
                    Buscar médicos
                  </Button>
                </div>
              </Paper>
            )}
          </Paper>
        </main>
      </React.Fragment>
    )
  }

  function doctorComponent() {
    return (
      <React.Fragment>
        <Container maxWidth="sm" component="main" className={styles.mainContainer}>
          <Avatar className={styles.avatar}>
            <AssistantIcon />
          </Avatar>
          <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
            Reinvente o seu jeito de atender consultas
            </Typography>
          <Typography variant="h5" align="center" color="textSecondary" component="p">
            Crie seus horários de atendimento informando duração das consultas, preços e a sua especialidade.
            </Typography>
        </Container>
        <main className={styles.layout}>
          <Paper elevation={3} className={styles.paper}>
            <Typography component="h5" variant="h5" className={styles.secondaryTitle}>
              Definição de horários
            </Typography>
          </Paper>
        </main>
      </React.Fragment>
    )
  }

  return fetchData === true ? (
    <React.Fragment>
      <div>
        <Dialog open={openDialog} onClose={handleClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você precisa selecionar seu estado, sua cidade e uma especialização médica.
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
          {userType === "Médico" ? doctorComponent() : patientComponent()}
        </Grid>
      </Grid >
      <Footer />
    </React.Fragment >
  ) : <div id="loader"><CircularProgress /></div>
}

const useStyles = makeStyles(theme => ({
  mainGrid: {
    backgroundColor: '#F5FFFA',
    minHeight: '100vh',
  },
  mainTitle: {
    fontWeight: 'bold',
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
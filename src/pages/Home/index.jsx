import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../../Context'
import axios from 'axios'

import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, Container, CssBaseline, Typography, Button, TextField, Avatar, Divider, IconButton, List,
  Paper, Stepper, Step, StepLabel, StepContent, Dialog, DialogTitle, ListItem, ListItemText,
  DialogContent, DialogContentText, DialogActions, Slide, CircularProgress, ListItemSecondaryAction
} from '@material-ui/core'
import { Autocomplete, Alert, AlertTitle } from '@material-ui/lab'

import AssistantIcon from '@material-ui/icons/Assistant'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SearchIcon from '@material-ui/icons/Search'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import DeleteIcon from '@material-ui/icons/Delete'

import { makeStyles } from '@material-ui/core/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

function getSteps() {
  return ['Selecione o seu estado', 'Selecione a sua cidade', 'Escolha a especialidade']
}

export default function Home({ history }) {
  const styles = useStyles()
  const steps = getSteps()

  const {
    globalLocation, setGlobalLocation, globalSpeciality, setGlobalSpeciality,
    setCpf, setPhone, setCardName, setCardNumber, setExpireDate, setSecurityCode,
    setCrm, setDescription, setCity, setSpeciality, setStreet, setStreetNumber,
    setNeighbour, setSelectedUf
  } = useContext(Context)



  const [openDialog, setOpenDialog] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [fetchData, setFetchData] = useState(false)

  const [userType, setUserType] = useState('')
  const [ufs, setUfs] = useState([])
  const [selectedHomeUf, setSelectedHomeUf] = useState([])
  const [cities, setCities] = useState([])
  const [specialities, setSpecialities] = useState([])
  const [schedules, setSchedules] = useState([])
  const [doctorPrice, setDoctorPrice] = useState('')

  function handleSearch() {
    if (globalLocation === "" || globalSpeciality === "") {
      setOpenDialog(true)
    } else {
      history.push('/search')
    }
  }

  function handleService() {
    history.push('/service')
  }

  function handleSymptom() {
    history.push('/symptom')
  }

  function handleCloseAlert() {
    setOpenAlert(false)
  }

  function handleDelete(key) {
    if (schedules.length === 1) {
      firebase.db.collection('doctors').doc(firebase.getId()).update({
        price: "Individual"
      })

      firebase.db.collection('doctors').doc(firebase.getId())
        .collection('schedules').doc(key).delete()
    } else {
      firebase.db.collection('doctors').doc(firebase.getId())
        .collection('schedules').doc(key).delete()
    }
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const handleReset = () => {
    setGlobalLocation("")
    setGlobalSpeciality("")
    setActiveStep(0);
  }

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
    if (firebase.getId() !== null) {
      firebase.db.collection("users").doc(firebase.getId()).get().then(doc => {
        if (doc.exists) {
          const { type } = doc.data()
          if (type === "Médico") {
            firebase.db.collection("doctors").doc(firebase.getId()).get().then(doc => {
              if (doc.exists) {
                const data = doc.data()
                setDoctorPrice(data.price)
              }
            })

            firebase.db.collection("doctors")
              .doc(firebase.getId())
              .collection("schedules")
              .orderBy("ordenation")
              .get().then(snapshot => {
                if (snapshot) {
                  let schedules = []
                  snapshot.forEach(schedule => {
                    schedules.push({
                      key: schedule.id,
                      ...schedule.data()
                    })
                  })
                  setUserType(type)
                  setSchedules(schedules)
                  setFetchData(true)
                }
              })
          } else if (type === "Paciente") {
            setUserType(type)
            setFetchData(true)
          }
        } else {
          setCpf('')
          setCrm('')
          setPhone('')
          setCardName('')
          setCardNumber('')
          setSecurityCode('')
          setExpireDate('')
          setDescription('')
          setCity('')
          setNeighbour('')
          setSpeciality('')
          setStreet('')
          setStreetNumber('')
          setSelectedUf('')
          setOpenAlert(true)
          setFetchData(true)
        }
      })
    } else {
      alert("Você foi desconectado. Faça login novamente.")
      history.push('/')
    }
  }, [
    history, setCardName, setCardNumber, setCity, setCpf, setCrm, setDescription,
    setExpireDate, setNeighbour, setPhone, setSecurityCode, setSelectedUf, setSpeciality,
    setStreet, setStreetNumber
  ])

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
          <Container>
            <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" gutterBottom>
              Reinvente o seu jeito de agendar consultas
            </Typography>
            <Typography component="h5" variant="h6" align="center" color="textSecondary" gutterBottom>
              Busque profissionais por meio da seleção de localização e especialidade médica.
            </Typography>
          </Container>
        </Container>
        <main className={styles.layout}>
          {openAlert === true && (
            <Alert severity="info" variant="standard" elevation={3} onClose={handleCloseAlert} className={styles.userAlert}>
              <AlertTitle>Informação</AlertTitle>
                  Para usar todas as funcionalidades é necessário criar seu o
                  perfil de médico ou paciente acessando a opção no menu superior.
            </Alert>
          )}
          <Alert severity="info" variant="standard" action={
            <Button color="inherit" size="small" onClick={handleSymptom}>
              Ir
              </Button>
          } elevation={3} className={styles.userAlert}>
            <AlertTitle>Busca baseada em sintomas</AlertTitle>
                  Encontre um médico recomendado ao selecionar seus sintomas.
              </Alert>
          <Grid container direction="column" alignItems="center" justify="center">
            <label className={styles.label}>• ou •</label>
          </Grid>

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
                          startIcon={<CheckCircleIcon />}
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
                    startIcon={<SearchIcon />}
                  >
                    Buscar
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
          <Container>
            <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
              Reinvente o seu jeito de atender consultas
            </Typography>
            <Typography component="h5" variant="h6" align="center" color="textSecondary">
              Visualize e cadastre seus dias de atendimento com horário, preço, duração e intervalo entre consultas.
          </Typography>
          </Container>
        </Container>
        {schedules.length === 0 && (
          <Container maxWidth="md" component="main">
            <Alert severity="info" variant="standard" action={
              <Button color="inherit" size="small" onClick={handleService}>
                Cadastrar
              </Button>
            } elevation={3}>
              <AlertTitle>Informação</AlertTitle>
                  Você ainda não cadastrou os dias de consulta.
              </Alert>
          </Container>
        )}
        {schedules.length > 0 && (
          <main className={styles.layout}>
            <Paper elevation={3} className={styles.paper}>
              <List>
                <Container maxWidth="md">
                  {doctorPrice !== "Individual" && (
                    <React.Fragment>
                      <Typography variant="h6" gutterBottom className={styles.title}>
                        Dados das consultas
                      </Typography>
                      <Grid container direction="row">
                        <Typography className={styles.typography} gutterBottom>Preço:</Typography>
                        <Typography gutterBottom>{`R$ ${doctorPrice}`}</Typography>
                      </Grid>
                    </React.Fragment>
                  )}
                </Container>
                {schedules.map((schedule) => (
                  <Container maxWidth="md">
                    <Typography variant="h6" gutterBottom className={styles.title}>
                      {schedule.day}
                    </Typography>
                    <ListItem key={schedule.key}>
                      <Grid container>
                        <Grid item sm={3} xs={6}>
                          <ListItemText primary="Atendimento" secondary={`${schedule.begin} às ${schedule.end}`} />
                        </Grid>
                        <Grid item sm={3} xs={6}>
                          <ListItemText primary="Duração" secondary={`${schedule.duration} minutos`} />
                        </Grid>
                        <Grid item sm={3} xs={6}>
                          <ListItemText primary="Intervalo" secondary={schedule.interval === 0 ? `Inexistente` : `${schedule.interval} minutos`} />
                        </Grid>
                        <Grid item sm={3} xs={6}>
                          {doctorPrice === "Individual" && (
                            <ListItemText primary="Preço" secondary={`R$ ${schedule.price}`} />
                          )}
                        </Grid>
                      </Grid>
                      <ListItemSecondaryAction>
                        <IconButton variant="contained" color="secondary">
                          <DeleteIcon onClick={() => handleDelete(schedule.key)} />
                        </IconButton>
                      </ListItemSecondaryAction>

                    </ListItem>
                    <Divider />
                  </Container>
                ))}
              </List>
              <div className={styles.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  className={styles.button}
                  onClick={handleService}
                  disabled={schedules.length === 5}
                  startIcon={<AddCircleIcon />}
                >
                  Cadastrar
              </Button>
              </div>
            </Paper>
          </main>
        )
        }
      </React.Fragment >
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
          {userType === "Médico" ?
            doctorComponent() : patientComponent()
          }
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
  },
  link: {
    color: '#8A8F9E',
    fontSize: '12px',
    margin: theme.spacing(2, 2, 2, 2)
  },
  label: {
    color: '#8A8F9E',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: '12px',
    marginBottom: 15
  },
}))
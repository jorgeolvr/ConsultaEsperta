import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, CircularProgress, CssBaseline, Container, Typography, Paper, Button, Avatar,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Slide, Divider, List, ListItem,
  ListItemText, ListItemAvatar
} from '@material-ui/core'

import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { Alert, AlertTitle } from '@material-ui/lab'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Comment from '@material-ui/icons/Comment'
import { makeStyles } from '@material-ui/core/styles'

import MomentUtils from '@date-io/moment'
import moment from 'moment'
import 'moment/locale/pt-br'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function Detail({ history }) {
  const styles = useStyles()
  const { idDoctor } = useLocation()

  if (idDoctor !== undefined) {
    localStorage.setItem('id', idDoctor)
  }

  const [fetchData, setFetchData] = useState(false)
  const [name, setName] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [neighbour, setNeighbour] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState('')
  const [image, setImage] = useState('')
  const [doctorSchedules, setDoctorSchedules] = useState([])
  const [ratings, setRatings] = useState([])
  const [selectedDate, handleDateChange] = useState(moment())
  const [hoursFiltered, setHoursFiltered] = useState([])

  const [idSchedule, setIdSchedule] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const [openDialog, setOpenDialog] = useState(false)
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false)

  useEffect(() => {
    firebase.db.collection('doctors').doc(localStorage.getItem('id')).get().then(function (doc) {
      if (doc.exists) {
        const {
          name, street, number, neighbour, image, rating,
          description, price, location, speciality
        } = doc.data()
        setName(name)
        setStreet(street)
        setNumber(number)
        setNeighbour(neighbour)
        setDescription(description)
        setPrice(price)
        setLocation(location)
        setSpeciality(speciality)
        setRating(rating)
        setImage(image)
      }
    })
  })

  useEffect(() => {
    var selectedDay = ''
    var hours = []

    if (selectedDate.day() === 0) {
      selectedDay = "Domingo"
    } else if (selectedDate.day() === 1) {
      selectedDay = "Segunda-feira"
    } else if (selectedDate.day() === 2) {
      selectedDay = "Terça-feira"
    } else if (selectedDate.day() === 3) {
      selectedDay = "Quarta-feira"
    } else if (selectedDate.day() === 4) {
      selectedDay = "Quinta-feira"
    } else if (selectedDate.day() === 5) {
      selectedDay = "Sexta-feira"
    } else if (selectedDate.day() === 6) {
      selectedDay = "Sábado"
    }

    firebase.db.collection('doctors').doc(localStorage.getItem('id'))
      .collection('schedules').where("day", "==", selectedDay)
      .get()
      .then(snapshot => {
        if (snapshot) {
          let doctorSchedules = []
          snapshot.forEach(doctorSchedule => {
            doctorSchedules.push({
              key: doctorSchedule.id,
              ...doctorSchedule.data()
            })
          })
          setDoctorSchedules(doctorSchedules)

          doctorSchedules.map(schedule => {
            return hours = schedule.times
          })

          firebase.db.collection('appointments')
            .where("date", "==", selectedDate.format("DD/MM/YYYY").toString())
            .where("status", "==", "confirmed")
            .get()
            .then(snapshot => {
              if (snapshot) {
                snapshot.forEach(appointment => {
                  hours = hours.filter(hour => hour !== appointment.data().hour)
                })
                setHoursFiltered(hours)
              }
            })
        }

        firebase.db.collection('ratings')
          .where("doctorId", "==", localStorage.getItem('id'))
          .where("commentedBy", "==", "Paciente")
          .get().then(snapshot => {
            if (snapshot) {
              let ratings = []
              snapshot.forEach(rating => {
                ratings.push({
                  key: ratings.id,
                  ...rating.data()
                })
              })
              setRatings(ratings)
            }
          })
        setFetchData(true)
      })
  }, [history, selectedDate])

  console.log(ratings)

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleCloseDialogConfirm = () => {
    setOpenDialogConfirm(false)
  }

  function handleStackbar(key, day, time) {
    setIdSchedule(key)
    setSelectedDay(day)
    setSelectedTime(time)

    firebase.db.collection('users')
      .doc(firebase.getId())
      .get()
      .then(function (doc) {
        if (!doc.exists) {
          setOpenDialog(true)
        } else {
          setOpenDialogConfirm(true)
        }
      })
  }

  const handleAppointment = () => {
    firebase.db.collection('appointments').doc().set({
      idPatient: firebase.getId(),
      patientName: firebase.getUsername(),
      idDoctor: localStorage.getItem('id'),
      idSchedule: idSchedule,
      doctorName: name,
      address: `${street}, ${number} - ${neighbour}`,
      day: selectedDay,
      date: selectedDate.format("DD/MM/YYYY").toString(),
      hour: selectedTime,
      status: "confirmed",
      patientRated: "no",
      doctorRated: "no"
    })
    history.push('/schedule')
  }

  return fetchData === true ? (
    <React.Fragment>
      <div>
        <Dialog open={openDialog} onClose={handleClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você precisa completar seu perfil com dados pessoais e forma de pagamento
              antes de marcar uma consulta médica.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={openDialogConfirm} onClose={handleCloseDialogConfirm} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Marcação de consulta</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você deseja confirmar a marcação de consulta para {selectedDay.toLowerCase()},
              dia {selectedDate.format("DD/MM/YYYY").toString()} às {selectedTime}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogConfirm} color="secondary" autoFocus>Cancelar</Button>
            <Button onClick={handleAppointment} color="primary" autoFocus>Confirmar</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Grid container className={styles.mainGrid} direction="column">
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <Header />
          </Container>
          <Container>
            <Container maxWidth="sm" component="main" className={styles.mainContainer}>
              <Grid direction="row" className={styles.avatar}>
                <Avatar src={image} className={styles.large} />
                <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" gutterBottom>
                  {name}
                </Typography>
                <Typography component="h5" variant="h6" align="center" color="textSecondary" gutterBottom>
                  {description}
                </Typography>
              </Grid>
            </Container>
          </Container>
          <main className={styles.layout}>
            <Paper className={styles.paper} elevation={3}>
              <Grid container direction="row">
                <Typography className={styles.typography} gutterBottom>Endereço:</Typography>
                <Typography gutterBottom>{`${street}, ${number} - ${neighbour}`}</Typography>
              </Grid>
              <Grid container spacing={2} className={styles.information}>
                <Grid item container direction="column" xs={12} sm={6}>
                  <Grid container direction="row">
                    <Typography className={styles.typography} gutterBottom>Cidade:</Typography>
                    <Typography gutterBottom>{location}</Typography>
                  </Grid>
                  <Grid container direction="row">
                    <Typography className={styles.typography} gutterBottom>Especialidade:</Typography>
                    <Typography gutterBottom>{speciality}</Typography>
                  </Grid>
                </Grid>
                <Grid item container direction="column" xs={12} sm={6}>
                  {price !== "Individual" && (
                    <Grid container direction="row">
                      <Typography className={styles.typography} gutterBottom>Preço das consultas:</Typography>
                      <Typography gutterBottom>R$ {price}</Typography>
                    </Grid>
                  )}
                  <Grid container direction="row">
                    <Typography className={styles.typography} gutterBottom>Avaliação:</Typography>
                    <Typography gutterBottom>{rating} estrelas</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <Grid className={styles.expansionPanel}>
              <ExpansionPanel fullWidth elevation={3} >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={styles.heading}>Consultas disponíveis</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Container maxWidth="md">
                    <MuiPickersUtilsProvider utils={MomentUtils} locale="pt-br">
                      <DatePicker
                        disablePast
                        format="DD/MM/yyyy"
                        value={selectedDate}
                        onChange={handleDateChange}
                        label="Selecione uma data"
                        cancelLabel="Cancelar"
                        fullWidth
                      />
                    </MuiPickersUtilsProvider>
                    <Grid style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: 8
                    }}>
                    </Grid>
                    <Grid className={styles.hourGrid}>
                      {doctorSchedules.length === 0 && (
                        <Alert severity="warning" variant="standard">
                          <AlertTitle>Atenção</AlertTitle>
                          O médico não possui horários disponíveis no dia selecionado.
                        </Alert>
                      )}
                      {hoursFiltered.length !== 0 && doctorSchedules.map((doctorSchedule) => (
                        <React.Fragment>
                          <Grid container style={{ marginBottom: 5 }}>
                            <Grid item container direction="column" xs={12} sm={6}>
                              <Grid container direction="row">
                                <Typography className={styles.typography} gutterBottom>Dia da semana:</Typography>
                                <Typography gutterBottom>{doctorSchedule.day}</Typography>
                              </Grid>
                              {price === "Individual" && (
                                <Grid container direction="row">
                                  <Typography className={styles.typography} gutterBottom>Preço da consulta:</Typography>
                                  <Typography gutterBottom>R$ {doctorSchedule.price}</Typography>
                                </Grid>
                              )}
                            </Grid>
                            <Grid item container direction="column" xs={12} sm={6}>
                              <Grid container direction="row">
                                <Typography className={styles.typography} gutterBottom>Duração da consulta:</Typography>
                                <Typography gutterBottom>{doctorSchedule.duration} minutos</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Divider />
                          <Grid container spacing={1} className={styles.hourGrid}>
                            {hoursFiltered.map((time) => (
                              <Grid item key={time.key} xs={4} sm={2}>
                                <Button
                                  color="primary"
                                  variant="outlined"
                                  onClick={() =>
                                    handleStackbar(doctorSchedule.key, doctorSchedule.day, time)
                                  }
                                >
                                  {time}
                                </Button>
                              </Grid>
                            ))}
                          </Grid>
                        </React.Fragment>
                      ))}
                    </Grid>
                  </Container>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel fullWidth elevation={3} >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={styles.heading}>Comentários ({ratings.length})</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <List className={styles.commentGrid}>
                    {ratings.map(rating => (
                      <React.Fragment>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <Comment />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={rating.commentary} secondary={rating.username} />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </main>
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment >
  ) : <div id="loader"><CircularProgress /></div>
}

const useStyles = makeStyles(theme => ({
  mainGrid: {
    backgroundColor: '#F5FFFA',
    minHeight: '100vh'
  },
  avatar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  information: {
    marginTop: 20
  },
  rating: {
    fontSize: 40,
  },
  expansionGrid: {
    paddingBottom: theme.spacing(2),
  },
  expansionPanel: {
    marginBottom: theme.spacing(8)
  },
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  dates: {
    marginTop: theme.spacing(3),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
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
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      padding: theme.spacing(3),
    },
  },
  title: {
    marginTop: theme.spacing(2),
    fontWeight: 'bold'
  },
  typography: {
    fontWeight: 'bold',
    marginRight: 5
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginBottom: theme.spacing(3),
  },
  mainContainer: {
    padding: theme.spacing(6, 0, 6),
  },
  resultContainer: {
    paddingTop: theme.spacing(20)
  },
  mainTitle: {
    fontWeight: 'bold',
    marginTop: theme.spacing(2),
    color: '#322153',
    fontFamily: 'Ubuntu',
  },
  hourGrid: {
    marginTop: 20
  },
  commentGrid: {
    width: '100%'
  }
}))
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, CircularProgress, CssBaseline, Container, Typography, ListItemSecondaryAction, List, ListItem,
  ListItemText, Paper, Button, Avatar, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide, IconButton, Divider
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import EventAvailable from '@material-ui/icons/EventAvailable'
import { makeStyles } from '@material-ui/core/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function Details({ history }) {
  const styles = useStyles()
  //const { idDoctor } = useLocation()
  const { idDoctor } = useParams()

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

  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    firebase.db.collection('doctors').doc(idDoctor).get().then(function (doc) {
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
  }, [idDoctor, setName, setStreet, setNumber, setNeighbour, setPrice, setImage])

  useEffect(() => {
    firebase.db.collection('doctors').doc(idDoctor)
      .collection('schedules').get().then(snapshot => {
        if (snapshot) {
          let doctorSchedules = []
          snapshot.forEach(doctorSchedule => {
            if (doctorSchedule.data().status === "available") {
              doctorSchedules.push({
                key: doctorSchedule.id,
                ...doctorSchedule.data()
              })
            }
          })
          setDoctorSchedules(doctorSchedules)
          setFetchData(true)
        }
      })
  }, [idDoctor, setDoctorSchedules])

  const handleClose = () => {
    setOpenDialog(false)
  };

  const handleAppointment = (idSchedule, daySchedule, hourSchedule) => {
    firebase.db.collection('users').doc(firebase.getId()).get().then(function (doc) {
      if (!doc.exists) {
        setOpenDialog(true)
      } else {
        firebase.db.collection('appointments').doc().set({
          idPatient: firebase.getId(),
          idDoctor: idDoctor,
          idSchedule: idSchedule,
          doctorName: name,
          address: `${street}, ${number} - ${neighbour}`,
          day: daySchedule,
          hour: hourSchedule,
          status: "pending"
        })

        firebase.db.collection('doctors').doc(idDoctor).collection('schedules').doc(idSchedule).update({
          status: "unavailable"
        })

        history.push('/schedule')
      }
    })
  }

  return fetchData === true ? (
    <React.Fragment>
      <div>
        <Dialog open={openDialog} onClose={handleClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Agendamento de consultas</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você precisa completar seu perfil com dados pessoais e forma de pagamento
              antes de marcar uma consulta médica. Clique em perfil no menu principal para
              continuar.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" autoFocus>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Grid container className={styles.mainGrid} direction="column">
        <Container>
          <Grid container direction="column">
            <CssBaseline />
            <Container component="main" maxWidth="lg">
              <Header />
            </Container>
            <Container maxWidth="sm" component="main" className={styles.mainContainer}>
              <Grid direction="row" className={styles.avatar}>
                <Avatar src={image} className={styles.large} />
                <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
                  {name}
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                  {description}
                </Typography>
              </Grid>
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

                    <Grid container direction="row">
                      <Typography className={styles.typography} gutterBottom>Preço das consultas:</Typography>
                      <Typography gutterBottom>{price}</Typography>
                    </Grid>
                    <Grid container direction="row">
                      <Typography className={styles.typography} gutterBottom>Avaliação:</Typography>
                      <Typography gutterBottom>{rating} estrelas</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
              <Grid className={styles.expansionPanel}>
                {doctorSchedules.length === 0 ? (
                  <Alert severity="warning" variant="standard" elevation={3}>
                    <AlertTitle>Atenção</AlertTitle>
                  Esse médico não possui horários disponíveis.
                  </Alert>
                ) : (
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
                          <List>
                            {doctorSchedules.map((doctorSchedule) => (
                              <React.Fragment>
                                <ListItem>
                                  <ListItemText primary="Consulta para" secondary={doctorSchedule.day} />
                                  {price === "Individual" ? <ListItemText primary="Preço" secondary={doctorSchedule.price} /> : ""}
                                  <ListItemText primary="Horário" secondary={doctorSchedule.hour} />
                                  <ListItemText primary="Duração" secondary={doctorSchedule.duration} />
                                  <ListItemSecondaryAction>
                                    <IconButton variant="contained" color="primary" onClick={() => handleAppointment(doctorSchedule.key, doctorSchedule.day, doctorSchedule.hour)}>
                                      <EventAvailable />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                              </React.Fragment>
                            ))}
                          </List>
                        </Container>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  )}
              </Grid>
            </main>
          </Grid>
        </Container>
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
    //marginTop: theme.spacing(3),
    //marginLeft: theme.spacing(1),
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
    marginTop: theme.spacing(2)
  },
}));
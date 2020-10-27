import React, { useEffect, useState } from 'react'

import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, CircularProgress, CssBaseline, Container, Typography, Card,
  Button, CardContent, CardActions, Avatar
} from '@material-ui/core'
import WatchLaterIcon from '@material-ui/icons/WatchLater'
import { Alert, AlertTitle } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'

export default function Schedule() {
  const styles = useStyles()

  const [appointments, setAppointments] = useState([])
  const [fetchData, setFetchData] = useState(false)
  const [alertConfirm, setAlertConfirm] = useState(false)
  const [alertCancel, setAlertCancel] = useState(false)
  const [userType, setUserType] = useState('')

  useEffect(() => {
    firebase.db.collection("users").doc(firebase.getId()).get().then(doc => {
      if (doc.exists) {
        const { type } = doc.data()
        if (type === "Paciente") {
          firebase.db.collection('appointments')
            .where("idPatient", "==", firebase.getId())
            .get().then(snapshot => {
              if (snapshot) {
                let appointments = []
                snapshot.forEach(appointment => {
                  appointments.push({
                    key: appointment.id,
                    ...appointment.data()
                  })
                })
                setAppointments(appointments)
                setUserType(type)
                setFetchData(true)
              }
            })
        } else if (type === "Médico") {
          firebase.db.collection('appointments')
            .where("idDoctor", "==", firebase.getId())
            .get().then(snapshot => {
              if (snapshot) {
                let appointments = []
                snapshot.forEach(appointment => {
                  appointments.push({
                    key: appointment.id,
                    ...appointment.data()
                  })
                })
                setAppointments(appointments)
                setUserType(type)
                setFetchData(true)
              }
            })
        }
      } else {
        setFetchData(true)
      }
    })
  })

  function doctorComponent() {
    return (
      <React.Fragment>
        {appointments.map((appointment) => (
          <React.Fragment>
            <Grid item key={appointment.key} xs={12} sm={6} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography className={styles.title} color="textSecondary" gutterBottom>
                    Consulta marcada
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {appointment.patientName}
                  </Typography>
                  <Typography className={styles.information} color="textSecondary">
                    {appointment.date} às {appointment.hour}
                  </Typography>
                  <Typography variant="body1" component="p">
                    {appointment.address.split("-")[0]}
                  </Typography>
                  <Typography variant="body1" component="p">
                    {appointment.address.split("-")[1]}
                  </Typography>
                </CardContent>
                <CardActions>
                  {appointment.status === "confirmed" && (
                    <React.Fragment>
                      <Button size="small" disabled>Confirmado</Button>
                    </React.Fragment>
                  )}
                  {appointment.status === "cancelled" && (
                    <React.Fragment>
                      <Button size="small" disabled>Cancelado</Button>
                    </React.Fragment>
                  )}
                </CardActions>
              </Card>
            </Grid>
          </React.Fragment>
        ))}
      </React.Fragment>
    )
  }


  function patientComponent() {
    return (
      <React.Fragment>
        {appointments.map((appointment) => (
          <React.Fragment>
            <Grid item key={appointment.key} xs={12} sm={6} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography className={styles.title} color="textSecondary" gutterBottom>
                    Consulta marcada
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {appointment.doctorName}
                  </Typography>
                  <Typography className={styles.information} color="textSecondary">
                    {appointment.date} às {appointment.hour}
                  </Typography>
                  <Typography variant="body1" component="p">
                    {appointment.address.split("-")[0]}
                  </Typography>
                  <Typography variant="body1" component="p">
                    {appointment.address.split("-")[1]}
                  </Typography>
                </CardContent>
                <CardActions>

                  {appointment.status === "confirmed" && (
                    <React.Fragment>
                      <Button size="small" disabled>Confirmado</Button>
                      <Button size="small" onClick={() => handleCancel(appointment.key, appointment.idDoctor, appointment.idSchedule)} color="secondary">Cancelar</Button>
                    </React.Fragment>
                  )}
                  {appointment.status === "cancelled" && (
                    <React.Fragment>
                      <Button size="small" disabled>Cancelado</Button>
                    </React.Fragment>
                  )}
                </CardActions>
              </Card>
            </Grid>
          </React.Fragment>
        ))}
      </React.Fragment>
    )
  }

  function handleCancel(key, idDoctor, idSchedule) {
    firebase.db.collection('appointments').doc(key).update({
      status: "cancelled"
    })

    firebase.db.collection('doctors').doc(idDoctor).collection('schedules').doc(idSchedule).update({
      status: "available"
    })
    setAlertCancel(true)
  }

  return fetchData === true ? (
    <React.Fragment>
      <Grid container className={styles.mainGrid} direction="column">
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <Header />
          </Container>
          <Container>
            <Container maxWidth="sm" component="main" className={styles.mainContainer}>
              <Avatar className={styles.avatar}>
                <WatchLaterIcon />
              </Avatar>
              <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" gutterBottom>
                Minhas consultas
          </Typography>
              <Typography component="h5" variant="h6" align="center" color="textSecondary" gutterBottom>
                Visualize e confirme os dados de todas as suas consultas marcadas.
          </Typography>
            </Container>
          </Container>
          <Container className={styles.cardGrid} maxWidth="md">
            <Grid container spacing={4}>
              {alertConfirm === true && (
                <Container className={styles.alert} maxWidth="md" component="main">
                  <Alert onClose={() => { setAlertConfirm(false) }} severity="success" variant="standard" elevation={3}>
                    <AlertTitle>Sucesso</AlertTitle>
                  A sua consulta foi confirmada!
              </Alert>
                </Container>
              )}
              {alertCancel === true && (
                <Container className={styles.alert} maxWidth="md" component="main">
                  <Alert onClose={() => { setAlertCancel(false) }} severity="info" variant="standard" elevation={3}>
                    <AlertTitle>Informação</AlertTitle>
                  A sua consulta foi cancelada.
              </Alert>
                </Container>
              )}
              {appointments.length === 0 && (
                <Container maxWidth="md" component="main">
                  <Alert severity="info" variant="standard" elevation={3}>
                    <AlertTitle>Informação</AlertTitle>
                  Você ainda não possui nenhuma consulta marcada.
              </Alert>
                </Container>
              )}
              {userType === "Médico" ? doctorComponent() : patientComponent()}
            </Grid>
          </Container>
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
  }
}))
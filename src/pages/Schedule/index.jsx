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

  useEffect(() => {
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
          setFetchData(true)
        }
      })
  }, [appointments])

  function handleConfirm(key) {
    firebase.db.collection('appointments').doc(key).update({
      status: "confirmed"
    })
    setAlertConfirm(true)
  }

  function handleCancel(key, idDoctor, idSchedule) {
    console.log(idSchedule)
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
        <Container>
          <Grid container direction="column">
            <CssBaseline />
            <Container component="main" maxWidth="lg">
              <Header />
            </Container>
            <Container maxWidth="sm" component="main" className={styles.mainContainer}>
              <Avatar className={styles.avatar}>
                <WatchLaterIcon />
              </Avatar>
              <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" gutterBottom>
                Minha agenda
          </Typography>
              <Typography component="h5" variant="h6" align="center" color="textSecondary" gutterBottom>
                Visualize e confirme os dados de todas as suas consultas marcadas.
          </Typography>
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
                {appointments.map((appointment) => (
                  <Container maxWidth="md" component="main">
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
                            {appointment.day} às {appointment.hour}
                          </Typography>
                          <Typography variant="body1" component="p">
                            {appointment.address}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          {appointment.status === "pending" && (
                            <React.Fragment>
                              <Button size="small" onClick={() => handleConfirm(appointment.key)} color="primary">Confirmar</Button>
                              <Button size="small" onClick={() => handleCancel(appointment.key, appointment.idDoctor, appointment.idSchedule)} color="secondary">Cancelar</Button>
                            </React.Fragment>
                          )}
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
                  </Container>
                ))}
              </Grid>
            </Container>
          </Grid>
        </Container>
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
  }
}))
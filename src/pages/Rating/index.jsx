import React, { useState, useEffect } from 'react'

import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, Container, CssBaseline, Typography, Avatar,
  Button, CircularProgress, Card, CardContent, CardActions
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import CommentIcon from '@material-ui/icons/Comment'

import { makeStyles } from '@material-ui/core/styles'

export default function Rating({ history }) {
  const styles = useStyles()

  const [appointments, setAppointments] = useState([])
  const [fetchData, setFetchData] = useState(false)
  const [userType, setUserType] = useState('')

  useEffect(() => {
    firebase.db.collection("users").doc(firebase.getId()).get().then(doc => {
      if (doc.exists) {
        const { type } = doc.data()
        if (type === "Paciente") {
          firebase.db.collection('appointments')
            .where("idPatient", "==", firebase.getId())
            .where("status", "==", "confirmed")
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
            .where("status", "==", "confirmed")
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
                    Paciente
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
                  {appointment.doctorRated === "no" ?
                    <Button size="small" color="primary" onClick={() => history.push({
                      pathname: '/form',
                      idDoctor: appointment.idDoctor
                    })}>Avaliar</Button> :
                    <Button size="small" disabled>Avaliado</Button>
                  }
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
                    Médico
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
                  {appointment.patientRated === "no" ?
                    <Button size="small" color="primary" onClick={() => history.push({
                      pathname: '/form',
                      idDoctor: appointment.idDoctor,
                      idPatient: appointment.idPatient,
                      idAppointment: appointment.key,
                      date: appointment.date
                    })}>Avaliar</Button> :
                    <Button size="small" disabled>Avaliado</Button>
                  }
                </CardActions>
              </Card>
            </Grid>
          </React.Fragment>
        ))}
      </React.Fragment>
    )
  }

  return fetchData === true ? (
    <React.Fragment>
      <Grid container className={styles.mainGrid} direction="column">
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <Header />
          </Container>
          <Container maxWidth="sm" component="main" className={styles.mainContainer}>
            <Avatar className={styles.avatar}>
              <CommentIcon />
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
                Minhas avaliações
              </Typography>
              <Typography
                component="h5"
                variant="h6"
                align="center"
                color="textSecondary"
              >
                Avalie as métricas com notas e escreva um comentário
                sobre as suas consultas realizadas.
              </Typography>
            </Container>
          </Container>
          <Container className={styles.cardGrid} maxWidth="md">
            <Grid container spacing={4}>
              {appointments.length === 0 && (
                <Container maxWidth="md" component="main">
                  <Alert severity="info" variant="standard" elevation={3}>
                    <AlertTitle>Informação</AlertTitle>
                    Você ainda não possui nenhuma consulta confirmada.
                  </Alert>
                </Container>
              )}
              {userType === "Médico" ? doctorComponent() : patientComponent()}
            </Grid>
          </Container>
        </Grid>
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
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

export default function Schedule({ history }) {
  const styles = useStyles()

  const [appointments, setAppointments] = useState([])
  const [fetchData, setFetchData] = useState(false)

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
  }, [])

  function handleConfirm(key) {
    firebase.db.collection('appointments').doc(key).update({
      status: "confirmed"
    })
    history.push('/confirmed')
  }

  function handleCancel(key, idDoctor, idSchedule) {
    console.log(idSchedule)
    firebase.db.collection('appointments').doc(key).update({
      status: "cancelled"
    })

    firebase.db.collection('doctors').doc(idDoctor).collection('schedules').doc(idSchedule).update({
      status: "available"
    })
    history.push('/cancelled')
  }

  return fetchData === true ? (
    <React.Fragment>
      <Grid container className={styles.mainGrid} direction="column">
        <CssBaseline />
        <Container component="main" maxWidth="lg">
          <Header />
        </Container>
        <Container maxWidth="sm" component="main" className={styles.mainContainer}>
          <Avatar className={styles.avatar}>
            <WatchLaterIcon />
          </Avatar>
          <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
            Minha agenda
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" component="p">
            Confirme e visualize dados de todas as consultas que você marcou.
          </Typography>
        </Container>
        <Container className={styles.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {appointments.length === 0 && (
              <Container maxWidth="md" component="main">
                <Alert severity="warning" variant="standard" elevation={3}>
                  <AlertTitle>Atenção</AlertTitle>
                  Você não possui nenhuma consulta!
              </Alert>
              </Container>
            )}
            {appointments.map((app) => (
              <Grid item key={app.key} xs={12} sm={6} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography className={styles.title} color="textSecondary" gutterBottom>
                      Consulta marcada
                                        </Typography>
                    <Typography variant="h5" component="h2">
                      {app.doctorName}
                    </Typography>
                    <Typography className={styles.pos} color="textSecondary">
                      {app.date}
                    </Typography>
                    <Typography variant="body1" component="p">
                      {app.address}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {app.status === "pending" && (
                      <React.Fragment>
                        <Button size="small" onClick={() => handleConfirm(app.key)} color="primary">Confirmar</Button>
                        <Button size="small" onClick={() => handleCancel(app.key, app.idDoctor, app.idSchedule)} color="secondary">Cancelar</Button>
                      </React.Fragment>
                    )}
                    {app.status === "confirmed" && (
                      <React.Fragment>
                        <Button size="small" disabled>Confirmado</Button>
                      </React.Fragment>
                    )}
                    {app.status === "cancelled" && (
                      <React.Fragment>
                        <Button size="small" disabled>Cancelado</Button>
                      </React.Fragment>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
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
    fontWeight: 'bold'
  },
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  }
}))
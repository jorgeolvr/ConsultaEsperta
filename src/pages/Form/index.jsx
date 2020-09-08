import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, Container, CssBaseline, Typography, Avatar, Accordion, Button,
  CircularProgress, AccordionSummary, AccordionDetails, Box, TextField,
  AccordionActions, Divider, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Slide, Chip
} from '@material-ui/core'
import { Rating } from '@material-ui/lab'

import {
  StarRate, EventAvailable, ExpandMore, Face
} from '@material-ui/icons'

import { makeStyles } from '@material-ui/core/styles'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function Form({ history }) {
  const styles = useStyles()
  const { idDoctor, idAppointment, idPatient, date } = useLocation()

  const [fetchData, setFetchData] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [openAlertDialog, setOpenAlertDialog] = useState(false)

  const [userType, setUserType] = useState('')

  const [name, setName] = useState('')
  const [doctorRating, setDoctorRating] = useState('')
  const [patientRating, setPatientRating] = useState('')

  const [treatment, setTreatment] = useState(0)
  const [punctuality, setPunctuality] = useState(0)
  const [privacy, setPrivacy] = useState(0)
  const [communication, setCommunication] = useState(0)
  const [personality, setPersonality] = useState(0)

  const [cleaning, setCleaning] = useState(0)
  const [organization, setOrganization] = useState(0)
  const [security, setSecurity] = useState(0)
  const [equipment, setEquipment] = useState(0)

  const [commentary, setCommentary] = useState('')

  useEffect(() => {
    if (idDoctor !== undefined) {
      localStorage.setItem('idDoctor', idDoctor)
    }

    if (idPatient !== undefined) {
      localStorage.setItem('idPatient', idPatient)
    }

    if (idAppointment !== undefined) {
      localStorage.setItem('idAppointment', idAppointment)
    }

    if (date !== undefined) {
      localStorage.setItem('date', date)
    }

    firebase.db.collection("users").doc(firebase.getId()).get().then(doc => {
      if (doc.exists) {
        const { type } = doc.data()
        if (type === 'Paciente') {
          firebase.db.collection('doctors').doc(localStorage.getItem('idDoctor'))
            .get().then(function (doc) {
              if (doc.exists) {
                const { name, rating } = doc.data()
                setName(name)
                setDoctorRating(rating)
                setUserType(type)
                setFetchData(true)
              }
            })
        } else if (type === 'Médico') {
          firebase.db.collection('patients').doc(localStorage.getItem('idPatient'))
            .get().then(function (doc) {
              if (doc.exists) {
                const { name, rating } = doc.data()
                setName(name)
                setPatientRating(rating)
                setUserType(type)
                setFetchData(true)
              }
            })
        }
      }
    })
  })

  function handleClear() {
    setTreatment(0)
    setPunctuality(0)
    setPrivacy(0)
    setPersonality(0)
    setCleaning(0)
    setCommunication(0)
    setOrganization(0)
    setSecurity(0)
    setEquipment(0)
    setCommentary('')
  }

  function handleDialog() {
    if (userType === "Paciente" && (
      treatment === 0 || punctuality === 0 || privacy === 0 ||
      personality === 0 || cleaning === 0 || organization === 0 ||
      security === 0 || equipment === 0 || commentary === '')) {
      setOpenAlertDialog(true)
    } else if (userType === "Médico" && (
      treatment === 0 || punctuality === 0 || communication === 0 ||
      commentary === ''
    )) {
      setOpenAlertDialog(true)
    } else {
      setOpenDialog(true)
    }
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleAlertClose = () => {
    setOpenAlertDialog(false)
  }

  function handleRating() {
    var avg = 0

    const doctorsRef = firebase.db.collection('doctors')
      .doc(localStorage.getItem('idDoctor'))
    const patientsRef = firebase.db.collection('patients')
      .doc(localStorage.getItem('idPatient'))
    const appointmentRef = firebase.db.collection('appointments')
      .doc(localStorage.getItem('idAppointment'))

    if (userType === 'Paciente') {
      firebase.db.collection('doctors').doc(localStorage.getItem('idDoctor'))
        .get().then(doc => {
          if (doc.exists) {
            const { rating } = doc.data()
            avg = (rating + treatment + punctuality + privacy + personality +
              cleaning + organization + security + equipment) / 9

            doctorsRef.update({
              rating: parseFloat(avg.toFixed(1))
            })

            appointmentRef.update({
              patientRated: 'yes'
            })
          }
        })

      firebase.db.collection('ratings').doc().set({
        doctorId: localStorage.getItem('id'),
        patientId: firebase.getId(),
        commentary: commentary,
        commentedBy: 'Paciente',
        username: firebase.getUsername()
      })
    } else if (userType === 'Médico') {
      firebase.db.collection('patients').doc(localStorage.getItem('idPatient'))
        .get().then(doc => {
          if (doc.exists) {
            const { rating } = doc.data()
            avg = (rating + treatment + punctuality + communication + personality) / 5

            patientsRef.update({
              rating: parseFloat(avg.toFixed(1))
            })

            appointmentRef.update({
              doctorRated: 'yes'
            })
          }
        })

      firebase.db.collection('ratings').doc().set({
        doctorId: localStorage.getItem('id'),
        patientId: firebase.getId(),
        commentary: commentary,
        commentedBy: 'Médico',
        username: firebase.getUsername()
      })
    }
    history.push('/rating')
  }

  function patientComponent() {
    return (
      <React.Fragment>
        <Container maxWidth="sm" component="main" className={styles.mainContainer}>
          <Avatar className={styles.avatar}>
            <Face />
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
              {name}
            </Typography>
            <Grid className={styles.gridChip}>
              <Chip
                className={styles.chip}
                size='medium'
                icon={<EventAvailable />}
                label={localStorage.getItem('date')}
              />
              <Chip size='medium' icon={<StarRate />} label={doctorRating} />
            </Grid>
          </Container>
        </Container>
        <Container className={styles.cardGrid} maxWidth="md">
          <Accordion defaultExpanded elevation={3}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <Typography className={styles.heading}>Médico</Typography>
              <Typography className={styles.secondaryHeading}>
                Avalie o profissional que te consultou
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Cordialidade</Typography>
                    <Rating value={treatment}
                      onChange={(event, newValue) => {
                        setTreatment(newValue);
                      }} />
                  </Box>
                </Grid>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Pontualidade</Typography>
                    <Rating value={punctuality}
                      onChange={(event, newValue) => {
                        setPunctuality(newValue)
                      }} />
                  </Box>
                </Grid>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Privacidade</Typography>
                    <Rating value={privacy}
                      onChange={(event, newValue) => {
                        setPrivacy(newValue)
                      }} />
                  </Box>
                </Grid>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Personalidade</Typography>
                    <Rating value={personality}
                      onChange={(event, newValue) => {
                        setPersonality(newValue)
                      }} />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <Typography className={styles.heading}>Local</Typography>
              <Typography className={styles.secondaryHeading}>
                Avalie o local onde você foi atendido
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Limpeza</Typography>
                    <Rating value={cleaning}
                      onChange={(event, newValue) => {
                        setCleaning(newValue)
                      }} />
                  </Box>
                </Grid>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Organização</Typography>
                    <Rating value={organization}
                      onChange={(event, newValue) => {
                        setOrganization(newValue)
                      }} />
                  </Box>
                </Grid>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Segurança</Typography>
                    <Rating value={security}
                      onChange={(event, newValue) => {
                        setSecurity(newValue)
                      }} />
                  </Box>
                </Grid>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Equipamentos</Typography>
                    <Rating value={equipment}
                      onChange={(event, newValue) => {
                        setEquipment(newValue)
                      }} />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <Typography className={styles.heading}>Comentário</Typography>
              <Typography className={styles.secondaryHeading}>Escreva um breve texto sobre a consulta</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid item sm={12} xs={12}>
                  <Box component="fieldset" borderColor="transparent">
                    <TextField
                      multiline
                      fullWidth
                      variant="outlined"
                      inputProps={{
                        maxLength: 120
                      }}
                      value={commentary}
                      onChange={event => setCommentary(event.target.value)}
                    />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
            <Divider />
            <AccordionActions>
              <Button size="small" onClick={handleClear}>Limpar</Button>
              <Button size="small" color="primary" onClick={handleDialog}>Enviar avaliação</Button>
            </AccordionActions>
          </Accordion>
        </Container>
      </React.Fragment>
    )
  }

  function doctorComponent() {
    return (
      <React.Fragment>
        <Container maxWidth="sm" component="main" className={styles.mainContainer}>
          <Avatar className={styles.avatar}>
            <Face />
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
              {name}
            </Typography>
            <Grid className={styles.gridChip}>
              <Chip
                className={styles.chip}
                size='medium'
                icon={<EventAvailable />}
                label={localStorage.getItem('date')}
              />
              <Chip size='medium' icon={<StarRate />} label={patientRating} />
            </Grid>
          </Container>
        </Container>
        <Container className={styles.cardGrid} maxWidth="md">
          <Accordion defaultExpanded elevation={3}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <Typography className={styles.heading}>Paciente</Typography>
              <Typography className={styles.secondaryHeading}>Avalie o cliente que você consultou</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Cordialidade</Typography>
                    <Rating value={treatment}
                      onChange={(event, newValue) => {
                        setTreatment(newValue)
                      }} />
                  </Box>
                </Grid>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Pontualidade</Typography>
                    <Rating value={punctuality}
                      onChange={(event, newValue) => {
                        setPunctuality(newValue)
                      }} />
                  </Box>
                </Grid>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Comunicação</Typography>
                    <Rating value={communication}
                      onChange={(event, newValue) => {
                        setCommunication(newValue)
                      }} />
                  </Box>
                </Grid>
                <Grid item sm={3} xs={6}>
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Personalidade</Typography>
                    <Rating value={personality}
                      onChange={(event, newValue) => {
                        setPersonality(newValue)
                      }} />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <Typography className={styles.heading}>Comentário</Typography>
              <Typography className={styles.secondaryHeading}>Escreva um breve texto sobre a consulta</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid item sm={12} xs={12}>
                  <Box component="fieldset" borderColor="transparent">
                    <TextField
                      multiline
                      fullWidth
                      variant="outlined"
                      inputProps={{
                        maxLength: 120
                      }}
                      value={commentary}
                      onChange={event => setCommentary(event.target.value)}
                    />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
            <Divider />
            <AccordionActions>
              <Button size="small" onClick={handleClear}>Limpar</Button>
              <Button size="small" variant="contained" color="primary" onClick={handleDialog}>Enviar avaliação</Button>
            </AccordionActions>
          </Accordion>
        </Container>
      </React.Fragment>
    )
  }

  return fetchData === true ? (
    <React.Fragment>
      <div>
        <Dialog open={openDialog} onClose={handleClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Avaliação</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você deseja enviar a solicitação? Após o envio a avaliação não poderá
              ser alterada.
        </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" autoFocus>Não</Button>
            <Button onClick={handleRating} color="primary" autoFocus>Sim</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={openAlertDialog} onClose={handleAlertClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você precisa avaliar todas as métricas e fazer um comentário para enviar
              a sua avaliação.
        </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAlertClose} color="primary" autoFocus>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <Header />
          </Container>
          {userType === "Paciente" ? patientComponent() : doctorComponent()}
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
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  gridChip: {
    display: 'flex',
    justifyContent: 'center'
  },
  chip: {
    marginRight: 10
  }
}))
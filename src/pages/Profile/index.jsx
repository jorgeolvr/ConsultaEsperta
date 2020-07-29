import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'

import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, Container, CssBaseline, Typography, Paper, Button, CircularProgress, Slide,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar
} from '@material-ui/core'
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar'
import { makeStyles } from '@material-ui/core/styles'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function Profile({ history }) {
  const [fetchData, setFetchData] = useState(false)
  const styles = useStyles()

  const {
    name, setName, email, setEmail, cpf, setCpf, phone, setPhone, type,
    setType, cardName, setCardName, cardNumber, setCardNumber, brand,
    setBrand, expireDate, setExpireDate, securityCode, setSecurityCode,
    crm, setCrm, street, setStreet, streetNumber, setStreetNumber,
    neighbour, setNeighbour, speciality, setSpeciality, description,
    setDescription, selectedUf, setSelectedUf, city, setCity
  } = useContext(Context)
  const lastDigitsCard = cardNumber.split(" ")[3]
  const [openDialog, setOpenDialog] = useState(false)

  function handleUpdate() {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  function handlePatient() {
    history.push('/patient')
  }

  function handleDoctor() {
    history.push('/doctor')
  }

  useEffect(() => {
    firebase.db.collection('users').doc(firebase.getId()).get().then(function (doc) {
      if (doc.exists) {
        const { name, email, cpf, phone, type } = doc.data()
        setName(name)
        setEmail(email)
        setCpf(cpf)
        setPhone(phone)
        setType(type)
        setFetchData(true)
      }
    })
  })

  useEffect(() => {
    if (type === "Paciente") {
      firebase.db.collection('patients').doc(firebase.getId()).get().then(function (doc) {
        if (doc.exists) {
          const { cardName, number, brand, expireDate, securityCode } = doc.data()
          setCardName(cardName)
          setCardNumber(number)
          setBrand(brand)
          setExpireDate(expireDate)
          setSecurityCode(securityCode)
          setFetchData(true)
        }
      })
    } else if (type === "Médico") {
      firebase.db.collection('doctors').doc(firebase.getId()).get().then(function (doc) {
        if (doc.exists) {
          const { crm, street, number, neighbour, state, location, speciality, description } = doc.data()

          setStreet(street)
          setStreetNumber(number)
          setNeighbour(neighbour)
          setSelectedUf(state)
          setCrm(crm)
          setCity(location)
          setSpeciality(speciality)
          setDescription(description)
          setFetchData(true)
        }
      })
    }
  })

  return fetchData === true ? (
    <React.Fragment>
      {type === "Paciente" ? (
        <React.Fragment>
          <div>
            <Dialog open={openDialog} onClose={handleClose} keepMounted TransitionComponent={Transition}>
              <DialogTitle>Alteração de perfil</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Precisamos que você nos informe o seu tipo de usuário. Selecione abaixo se você é um médico ou um paciente.
            </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDoctor} color="secondary" autoFocus>Médico</Button>
                <Button onClick={handlePatient} color="primary" autoFocus>Paciente</Button>
              </DialogActions>
            </Dialog>
          </div>
          <Grid container className={styles.mainGrid}>
            <Container>
              <Grid container direction="column">
                <CssBaseline />
                <Container component="main" maxWidth="lg">
                  <Header />
                </Container>
                <Container maxWidth="sm" component="main" className={styles.mainContainer}>
                  <Avatar className={styles.avatar}>
                    <PermContactCalendarIcon />
                  </Avatar>
                  <Typography
                    className={styles.mainTitle}
                    component="h2"
                    variant="h3"
                    align="center"
                    color="textPrimary"
                    gutterBottom
                  >
                    Meu perfil
            </Typography>
                  <Typography component="h5" variant="h6" align="center" color="textSecondary" gutterBottom>
                    Visualize ou altere os seus dados de autenticação, dados pessoais e forma de pagamento.
            </Typography>
                </Container>
                <main className={styles.layout}>
                  <Paper elevation={3} className={styles.paper}>
                    <Typography variant="h6" gutterBottom className={styles.title}>
                      Dados de Autenticação
              </Typography>
                    <Grid container direction="row">
                      <Typography className={styles.typography} gutterBottom>E-mail:</Typography>
                      <Typography gutterBottom>{email}</Typography>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom className={styles.title}>
                          Dados Pessoais
                         </Typography>
                        <Grid container direction="row">
                          <Typography className={styles.typography} gutterBottom>Nome:</Typography>
                          <Typography gutterBottom>{name}</Typography>
                        </Grid>
                        <Grid container direction="row">
                          <Typography className={styles.typography} gutterBottom>CPF:</Typography>
                          <Typography gutterBottom>{cpf}</Typography>
                        </Grid>
                        <Grid container direction="row">
                          <Typography className={styles.typography} gutterBottom>Telefone:</Typography>
                          <Typography gutterBottom>{phone}</Typography>
                        </Grid>
                        <Grid container direction="row">
                          <Typography className={styles.typography} gutterBottom>Tipo de Usuário:</Typography>
                          <Typography gutterBottom>{type}</Typography>
                        </Grid>
                      </Grid>
                      <Grid item container direction="column" xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom className={styles.title}>
                          Forma de Pagamento
                  </Typography>
                        <Grid container direction="row">
                          <Typography className={styles.typography} gutterBottom>Bandeira:</Typography>
                          <Typography gutterBottom>{brand}</Typography>
                        </Grid>
                        <Grid container direction="row">
                          <Typography className={styles.typography} gutterBottom>Dono do Cartão:</Typography>
                          <Typography gutterBottom>{cardName}</Typography>
                        </Grid>
                        <Grid container direction="row">
                          <Typography className={styles.typography} gutterBottom>Número do Cartão:</Typography>
                          <Typography gutterBottom>Final {lastDigitsCard}</Typography>
                        </Grid>
                        <Grid container direction="row">
                          <Typography className={styles.typography} gutterBottom>Expirado em:</Typography>
                          <Typography gutterBottom>{expireDate}</Typography>
                        </Grid>
                        <Grid container direction="row">
                          <Typography className={styles.typography} gutterBottom>CVV:</Typography>
                          <Typography gutterBottom>{securityCode}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <div className={styles.buttons}>
                      <Button variant="contained" color="primary" onClick={handleUpdate} className={styles.button}>
                        Alterar dados
                </Button>
                    </div>
                  </Paper>
                </main>
              </Grid>
            </Container>
          </Grid>
          <Footer />
        </React.Fragment>) : (
          <React.Fragment>
            <div>
              <Dialog open={openDialog} onClose={handleClose} keepMounted TransitionComponent={Transition}>
                <DialogTitle>Alteração de perfil</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Precisamos que você nos informe o seu tipo de usuário. Selecione abaixo se você é um médico ou um paciente.
                 </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDoctor} color="secondary" autoFocus>Médico</Button>
                  <Button onClick={handlePatient} color="primary" autoFocus>Paciente</Button>
                </DialogActions>
              </Dialog>
            </div>
            <Grid container className={styles.mainGrid}>
              <Container>
                <Grid container direction="column">
                  <CssBaseline />
                  <Container component="main" maxWidth="lg">
                    <Header />
                  </Container>
                  <Container maxWidth="sm" component="main" className={styles.mainContainer}>
                    <Avatar className={styles.avatar}>
                      <PermContactCalendarIcon />
                    </Avatar>
                    <Typography
                      className={styles.mainTitle}
                      component="h2"
                      variant="h3"
                      align="center"
                      gutterBottom
                    >
                      Meu perfil
                 </Typography>
                    <Typography component="h5" variant="h6" align="center" color="textSecondary" gutterBottom>
                      Visualize ou altere os seus dados de autenticação, dados pessoais e outras informações.
                 </Typography>
                  </Container>
                  <main className={styles.layout}>
                    <Paper elevation={3} className={styles.paper}>
                      <Typography variant="h6" gutterBottom className={styles.title}>
                        Dados de Autenticação
                   </Typography>
                      <Grid container direction="row">
                        <Typography className={styles.typography} gutterBottom>E-mail:</Typography>
                        <Typography gutterBottom>{email}</Typography>
                      </Grid>

                      <Typography variant="h6" gutterBottom className={styles.title}>
                        Informações de atendimento
                   </Typography>
                      <Grid container direction="row">
                        <Typography className={styles.typography} gutterBottom>Descrição:</Typography>
                        <Typography gutterBottom>{description}</Typography>
                      </Grid>
                      <Grid container direction="row">
                        <Typography className={styles.typography} gutterBottom>Especialidade:</Typography>
                        <Typography gutterBottom>{speciality}</Typography>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6" gutterBottom className={styles.title}>
                            Dados Pessoais
                       </Typography>
                          <Grid container direction="row">
                            <Typography className={styles.typography} gutterBottom>Nome:</Typography>
                            <Typography gutterBottom>{name}</Typography>
                          </Grid>
                          <Grid container direction="row">
                            <Typography className={styles.typography} gutterBottom>CPF:</Typography>
                            <Typography gutterBottom>{cpf}</Typography>
                          </Grid>
                          <Grid container direction="row">
                            <Typography className={styles.typography} gutterBottom>CRM:</Typography>
                            <Typography gutterBottom>{crm}</Typography>
                          </Grid>
                          <Grid container direction="row">
                            <Typography className={styles.typography} gutterBottom>Telefone:</Typography>
                            <Typography gutterBottom>{phone}</Typography>
                          </Grid>
                          <Grid container direction="row">
                            <Typography className={styles.typography} gutterBottom>Tipo de Usuário:</Typography>
                            <Typography gutterBottom>{type}</Typography>
                          </Grid>
                        </Grid>
                        <Grid item container direction="column" xs={12} sm={6}>
                          <Typography variant="h6" gutterBottom className={styles.title}>
                            Informações do local
                       </Typography>
                          <Grid container direction="row">
                            <Typography className={styles.typography} gutterBottom>Estado:</Typography>
                            <Typography gutterBottom>{selectedUf}</Typography>
                          </Grid>
                          <Grid container direction="row">
                            <Typography className={styles.typography} gutterBottom>Cidade:</Typography>
                            <Typography gutterBottom>{city}</Typography>
                          </Grid>
                          <Grid container direction="row">
                            <Typography className={styles.typography} gutterBottom>Rua:</Typography>
                            <Typography gutterBottom>{street}</Typography>
                          </Grid>
                          <Grid container direction="row">
                            <Typography className={styles.typography} gutterBottom>Número:</Typography>
                            <Typography gutterBottom>{streetNumber}</Typography>
                          </Grid>

                          <Grid container direction="row">
                            <Typography className={styles.typography} gutterBottom>Bairro:</Typography>
                            <Typography gutterBottom>{neighbour}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <div className={styles.buttons}>
                        <Button variant="contained" color="primary" onClick={handleUpdate} className={styles.button}>
                          Alterar dados
                     </Button>
                      </div>
                    </Paper>
                  </main>
                </Grid>
              </Container>
            </Grid>
            <Footer />
          </React.Fragment >
        )}
    </React.Fragment>
  ) : <div id="loader"><CircularProgress /></div>
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
    fontWeight: 'bold',
    color: '#322153',
    fontFamily: 'Ubuntu',
  },
  paper: {
    marginBottom: theme.spacing(8),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  title: {
    marginTop: theme.spacing(2),
    fontWeight: 'bold'
  },
  typography: {
    fontWeight: 'bold',
    marginRight: 5
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  }
}))
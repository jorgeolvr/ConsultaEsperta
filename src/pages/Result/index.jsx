import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'
import axios from 'axios'

import firebase from '../../config/Firebase'

import {
  Grid, Container, CssBaseline, Typography, Avatar, Card, CardMedia,
  CardContent, Chip, CircularProgress, CardActions, Button, Divider,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails,
  TextField, Slide, Dialog, DialogActions, DialogContent, DialogTitle,
  DialogContentText
} from '@material-ui/core'
import { Alert, AlertTitle, Autocomplete } from '@material-ui/lab'
import { StarRate, LocalHospital, ExpandMore, Search } from '@material-ui/icons'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { makeStyles } from '@material-ui/core/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function Result({ history }) {
  const styles = useStyles()

  const [ufs, setUfs] = useState([])
  const [symptoms, setSymptoms] = useState([])
  const [cities, setCities] = useState([])
  const [fetchData, setFetchData] = useState(false)
  const [diseases, setDiseases] = useState([])
  const [globalDiseaseName, setGlobalDiseaseName] = useState('')
  const [specialities, setSpecialities] = useState([])
  const [doctors, setDoctors] = useState([])
  const [open, setOpen] = useState(false)

  const {
    globalLocation, selectedSymptoms, setGlobalLocation, setSelectedSymptoms,
    selectedHomeUf, setSelectedHomeUf
  } = useContext(Context)

  const handleAdvancedSearch = () => {
    if (globalLocation === "" || selectedSymptoms.length < 3) {
      setOpen(true)
    } else {
      setFetchData(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
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
    firebase.db.collection('symptoms').orderBy("name").get().then(snapshot => {
      if (snapshot) {
        let symptoms = []
        snapshot.forEach(symptom => {
          symptoms.push({
            key: symptom.id,
            ...symptom.data()
          })
        })
        const symptomsNames = symptoms.map(symptom => symptom.name)
        setSymptoms(symptomsNames)
      }
    })
  }, [])

  useEffect(() => {
    if (localStorage.getItem("diseaseName") === null) {
      localStorage.setItem("location", globalLocation)

      firebase.db.collection('diseases').orderBy('name').get().then(snapshot => {
        if (snapshot) {
          let diseases = []
          snapshot.forEach(disease => {
            diseases.push({
              key: disease.id,
              ...disease.data()
            })
          })
          setDiseases(diseases)
        }
      })

      var sum = 0
      var globalSum = 0
      var quantity = 0
      var globalQuantity = 10

      diseases.forEach(disease => {
        disease.symptom.forEach(sym => {
          quantity = disease.quantitySymptoms
          for (var i = 0;i < selectedSymptoms.length;i++) {
            if (sym.name === selectedSymptoms[i]) {
              sum += sym.weight
              console.log("Doença: " + disease.name + " quantidade: " + quantity)
              if (sum > globalSum) { // if (sum >= globalSum)
                setGlobalDiseaseName(disease.name)
                localStorage.setItem("diseaseName", disease.name)
              }
              else if (sum === globalSum && quantity <= globalQuantity) {
                setGlobalDiseaseName(disease.name)
                localStorage.setItem("diseaseName", disease.name)
              }
            }
          }
        })

        if (sum >= globalSum) {
          globalSum = sum
        }

        if (quantity <= globalQuantity) {
          globalQuantity = quantity
        }

        sum = 0
        quantity = 0
      })
    }
  }, [globalLocation, diseases, specialities, selectedSymptoms, globalDiseaseName, doctors])

  useEffect(() => {
    if (localStorage.getItem("localSpeciality") === null) {
      firebase.db.collection('specialities').get().then(snapshot => {
        if (snapshot) {
          let specialities = []

          snapshot.forEach(speciality => {
            specialities.push({
              key: speciality.id,
              ...speciality.data()
            })
          })
          setSpecialities(specialities)
        }
      })

      specialities.forEach(speciality => {
        if (speciality.disease.includes(globalDiseaseName)) {
          localStorage.setItem('localSpeciality', speciality.name)
        }
      })
    }

    firebase.db.collection('doctors')
      .where("location", "==", localStorage.getItem("location"))
      .where("speciality", "==", localStorage.getItem("localSpeciality"))
      .get().then(snapshot => {
        if (snapshot) {
          let doctors = []
          snapshot.forEach(doctor => {
            doctors.push({
              key: doctor.id,
              ...doctor.data()
            })
          })
          setDoctors(doctors)

          // Leve atraso para renderização dos elementos em tela
          setTimeout(function () {
            setFetchData(true)
          }, 3000);
        }
      })
  }, [globalLocation, diseases, specialities, selectedSymptoms, globalDiseaseName, doctors])


  return fetchData === true ? (
    <React.Fragment>
      <div>
        <Dialog open={open} onClose={handleClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Para utilizar e continuar a busca recomendada você precisa selecionar seu estado, sua cidade,
              pelo menos três e no máximo dez sintomas.
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
          <Container maxWidth="sm" component="main" className={styles.mainContainer}>
            <Avatar className={styles.avatar}>
              <LocalHospital />
            </Avatar>
            <Container>
              <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" gutterBottom>
                {localStorage.getItem("localSpeciality")}
              </Typography>
              <Typography component="h5" variant="h6" align="center" color="textSecondary" gutterBottom>
                Baseado na análise dos sintomas selecionados diagnosticamos que talvez você possua {localStorage.getItem("diseaseName")}.
              </Typography>
            </Container>
          </Container>
          <Grid container>
            <Container className={styles.cardGrid} maxWidth="md">
              <ExpansionPanel elevation={3} style={{ marginBottom: 20 }}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={styles.heading}>Busca avançada</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={2} >
                    <Grid item xs={12} sm={4}>
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
                    </Grid>
                    <Grid item xs={12} sm={4}>
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
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        fullWidth
                        multiple
                        filterSelectedOptions
                        limitTags={1}
                        size="small"
                        options={symptoms}
                        getOptionLabel={symptoms => symptoms}
                        value={selectedSymptoms}
                        onChange={(event, newValue) => {
                          if (selectedSymptoms.length < 10) {
                            setSelectedSymptoms(newValue)
                          }
                        }}

                        renderInput={(params) => <TextField {...params} label="Sintomas" variant="standard" />}
                      />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
                <div className={styles.buttons}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAdvancedSearch}
                    className={styles.button}
                    startIcon={<Search />}
                  >
                    Buscar
                  </Button>
                </div>
              </ExpansionPanel>
              <Grid container className={styles.bar}>
                <Typography variant="subtitle1" component="p" gutterBottom>
                  Médicos encontrados ({doctors.length})
                    </Typography>
              </Grid>
              <Divider />
              {doctors.length === 0 && (
                <Alert className={styles.alert} severity="warning" variant="standard" elevation={3}>
                  <AlertTitle>Atenção</AlertTitle>
                  Essa pesquisa não retornou nenhum resultado!
                </Alert>
              )}
              {doctors.length !== 0 && (
                <Grid className={styles.grid} container spacing={4}>
                  {doctors.map((doctor) => (
                    <Grid item key={doctor.key} xs={12} sm={6} md={4}>
                      <Card className={styles.card} elevation={3}>
                        <CardMedia
                          className={styles.cardMedia}
                          image={doctor.image}
                          title="Imagem"
                        />
                        <CardContent className={styles.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {doctor.name}
                          </Typography>
                          <Typography>
                            {doctor.description}
                          </Typography>
                          <Grid className={styles.rating}>
                            <Chip icon={<StarRate />} label={doctor.rating} />
                          </Grid>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            color="primary"
                            onClick={() =>
                              history.push({
                                pathname: '/detail',
                                idDoctor: doctor.key
                              })}
                            className={styles.details}
                          >
                            Ver Detalhes
                            </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>)}
            </Container>
          </Grid>
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
  expansionGrid: {
    paddingBottom: theme.spacing(2),
  },
  rating: {
    marginTop: 10
  },
  details: {
    justifyContent: "flex-end"
  },
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  cardMedia: {
    paddingTop: '56.25%',
  },
  cardContent: {
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  mainContainer: {
    padding: theme.spacing(6, 0, 6),
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  resultContainer: {
    paddingTop: theme.spacing(20),
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
  alert: {
    marginTop: theme.spacing(3)
  },
  grid: {
    marginTop: theme.spacing(3)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  bar: {
    justifyContent: 'space-between',
  }
}))
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'

import firebase from '../../config/Firebase'

import {
  Grid, Container, CssBaseline, Typography, Avatar, Card, CardMedia,
  CardContent, Chip, CircularProgress, CardActions, Button, Divider
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import { StarRate, LocalHospital } from '@material-ui/icons'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { makeStyles } from '@material-ui/core/styles'

export default function Result({ history }) {
  const styles = useStyles()

  const [fetchData, setFetchData] = useState(true)
  const [diseases, setDiseases] = useState([])
  const [globalDiseaseName, setGlobalDiseaseName] = useState('')
  const [specialities, setSpecialities] = useState([])
  const [doctors, setDoctors] = useState([])

  const {
    globalLocation, selectedSymptoms
  } = useContext(Context)

  function handleSearch() {
    history.push("/symptom")
  }

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

      diseases.forEach(disease => {
        disease.symptom.forEach(sym => {

          for (var i = 0;i < selectedSymptoms.length;i++) {
            if (sym.name === selectedSymptoms[i]) {
              sum += sym.weight

              if (sum >= globalSum) {
                setGlobalDiseaseName(disease.name)
                localStorage.setItem("diseaseName", disease.name)
              }
            }
          }
        })

        if (sum >= globalSum) {
          globalSum = sum
        }

        sum = 0
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
          setFetchData(true)
        }
      })

  }, [globalLocation, diseases, specialities, selectedSymptoms, globalDiseaseName, doctors])


  return fetchData === true ? (
    <React.Fragment>
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
                Lista dos médicos ideais encontrados por meio dos seus sintomas selecionados.
              </Typography>
            </Container>

          </Container>
          <Grid container>
            <Container className={styles.cardGrid} maxWidth="md">
              <Grid container className={styles.bar}>
                <Grid>
                  <Typography variant="subtitle1" component="p" gutterBottom>
                    Médicos encontrados ({doctors.length})
                    </Typography>
                </Grid>
                <Grid>
                  <Button size="small" color="primary" onClick={handleSearch}>
                    Realizar nova busca
                  </Button>
                </Grid>
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
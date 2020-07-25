import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'
import axios from 'axios'

import firebase from '../../config/Firebase'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  Grid, Chip, Container, CircularProgress, CssBaseline, Card, Typography, Button,
  CardMedia, Slide, CardContent, CardActions, ExpansionPanel, ExpansionPanelSummary,
  ExpansionPanelDetails, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, TextField, Avatar
  //InputLabel, Select, MenuItem
} from '@material-ui/core'
import { Autocomplete, Alert, AlertTitle } from '@material-ui/lab'
import ListAltIcon from '@material-ui/icons/ListAlt'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import StarRate from '@material-ui/icons/Star'
import { makeStyles } from '@material-ui/core/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function Search({ history }) {
  const styles = useStyles()

  const [fetchData, setFetchData] = useState(false)
  const [doctors, setDoctors] = useState([])
  const [ufs, setUfs] = useState([])
  const [selectedUf, setSelectedUf] = useState('')
  const [cities, setCities] = useState([])
  const [specialities, setSpecialities] = useState([])

  const [openDialog, setOpenDialog] = useState(false)

  const {
    //price, setPrice,
    rating, setRating, location, setLocation,
    setSpeciality, speciality, globalLocation, globalSpeciality,
    setGlobalLocation, setGlobalSpeciality
    //date, setDate
  } = useContext(Context)

  const handleClose = () => {
    setOpenDialog(false)
  };

  // Busca os médicos de acordo com a pesquisa na tela inicial
  useEffect(() => {
    if (globalLocation !== "" && globalSpeciality !== "") {
      firebase.db.collection('doctors')
        .where("location", "==", globalLocation)
        .where("speciality", "==", globalSpeciality)
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
    } else {
      firebase.db.collection('doctors')
        .where("location", "==", location)
        .where("speciality", "==", speciality)
        //.where("price", "<=", price)
        //.where("date", "==", date)
        .where("rating", "==", rating)
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
    }
  }, [globalLocation, globalSpeciality, location, rating, speciality])

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
      //const states = res.data.map(uf => new Object({ 'initial': `${uf.sigla}`, 'name': `${uf.nome}` }))
      const states = res.data.map(uf => uf.sigla)
      setUfs(states)
    })
  }, [])

  useEffect(() => {
    // Carregar as cidades sempre que a UF mudar
    if (selectedUf === '0') {
      return
    }

    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(res => {
      const cityNames = res.data.map(city => city.nome)

      setCities(cityNames)
    })

  }, [selectedUf])

  useEffect(() => {
    firebase.db.collection("specialities").orderBy("name")
      .get().then(snapshot => {
        if (snapshot) {
          let specialities = []
          snapshot.forEach(speciality => {
            specialities.push({
              ...speciality.data()
            })
          })
          const specialityNames = specialities.map(speciality => speciality.name)
          setSpecialities(specialityNames)
        }
      })
  }, [])

  // Busca os médicos de acordo com a pesquisa avançada na tela de busca
  const handleAdvancedSearch = () => {
    if (location === "" || speciality === "" || rating === 0) {
      setOpenDialog(true)
    } else {
      console.log(rating)
      setFetchData(false)
      firebase.db.collection('doctors')
        .where("location", "==", location)
        .where("speciality", "==", speciality)
        //.where("price", "<=", price)
        //.where("date", "==", date)
        .where("rating", "==", rating)
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
            setGlobalLocation("")
            setGlobalSpeciality("")
            setFetchData(true)
          }
        })
    }
  }

  return fetchData === true ? (
    <React.Fragment>
      <div>
        <Dialog open={openDialog} onClose={handleClose} keepMounted TransitionComponent={Transition}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você precisa preencher todos os campos da pesquisa para continuar.
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
              <ListAltIcon />
            </Avatar>
            <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
              Lista de médicos
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" component="p">
              Aqui você pode encontrar todos os profissionais de acordo com a sua pesquisa.
            </Typography>
          </Container>
          <Grid container>
            <Container className={styles.expansionGrid} maxWidth="md">
              <ExpansionPanel elevation={3} style={{ marginBottom: 20 }}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
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
                        getOptionLabel={uf => uf}
                        value={selectedUf}
                        onChange={(event, newValue) => {
                          setSelectedUf(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} label="Estados" variant="standard" />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        fullWidth
                        options={cities}
                        getOptionLabel={cities => cities}
                        value={location}
                        disabled={selectedUf === ""}
                        onChange={(event, newValue) => {
                          setLocation(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} label="Cidades" variant="standard" />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        fullWidth
                        options={specialities}
                        getOptionLabel={specialities => specialities}
                        value={speciality}
                        onChange={(event, newValue) => {
                          setSpeciality(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} label="Especialidades" variant="standard" />}
                      />
                    </Grid>
                    {/*<Grid item xs={12} sm={4}>
                      <InputLabel shrink>
                        Faixa de preço
                                            </InputLabel>
                      <Select
                        fullWidth
                        displayEmpty
                        value={price}
                        onChange={event => setPrice(event.target.value)}
                      >
                        <MenuItem value={0} disabled>
                          <em>Escolha uma opção</em>
                        </MenuItem>
                        <MenuItem value={50}>Até 50 reais</MenuItem>
                        <MenuItem value={150}>Até 150 reais</MenuItem>
                        <MenuItem value={300}>Até 300 reais</MenuItem>
                        <MenuItem value={500}>Até 500 reais</MenuItem>
                        <MenuItem value={1000}>Até 1000 reais</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="Data"
                                                type="datetime-local"
                                                value={date}
                                                onChange={event => setDate(event.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                            </Grid>*/}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Avaliação"
                        type="number"
                        InputProps={{ inputProps: { min: 0, max: 5 } }}
                        value={rating}
                        onChange={event => setRating(event.target.value)}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
                <div className={styles.buttons}>
                  <Button variant="contained" color="primary" onClick={handleAdvancedSearch} className={styles.button}>
                    Buscar
                  </Button>
                </div>
              </ExpansionPanel>
              {doctors.length === 0 && (
                <Alert severity="warning" variant="standard" elevation={3}>
                  <AlertTitle>Atenção</AlertTitle>
                  Essa pesquisa não retornou nenhum resultado!
                </Alert>
              )}
            </Container>
            <Container className={styles.cardGrid} maxWidth="md">

              {doctors.length !== 0 && (
                <Grid container spacing={4}>
                  {doctors.map((doc) => (
                    <Grid item key={doc.key} xs={12} sm={6} md={4}>
                      <Card className={styles.card} elevation={3}>
                        <CardMedia
                          className={styles.cardMedia}
                          image={doc.image}
                          title="Image title"
                        />
                        <CardContent className={styles.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {doc.name}
                          </Typography>
                          <Typography>
                            {doc.description}
                          </Typography>
                          <Grid className={styles.rating}>
                            <Chip icon={<StarRate />} label={doc.rating} />
                          </Grid>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" onClick={() => history.push(`/doctor/${doc.key}`)} className={styles.details}>
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
      </Grid >
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
    fontWeight: 'bold'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  }
}));
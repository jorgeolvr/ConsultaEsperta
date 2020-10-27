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
  DialogActions, TextField, Avatar, Divider, InputLabel, Select, MenuItem
} from '@material-ui/core'
import { Autocomplete, Alert, AlertTitle } from '@material-ui/lab'
import ListAltIcon from '@material-ui/icons/ListAlt'
import SearchIcon from '@material-ui/icons/Search'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import StarRate from '@material-ui/icons/Star'
import { makeStyles } from '@material-ui/core/styles'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function Search({ history }) {
  const styles = useStyles()

  const [fetchData, setFetchData] = useState(false)

  const [ufs, setUfs] = useState([])
  const [cities, setCities] = useState([])
  const [specialities, setSpecialities] = useState([])

  const [openDialog, setOpenDialog] = useState(false)

  const {
    //price, setPrice,
    rating, setRating, location, setLocation, doctors, setDoctors,
    setSpeciality, speciality, globalLocation, globalSpeciality,
    setGlobalLocation, setGlobalSpeciality, selectedUf, setSelectedUf
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
            setGlobalLocation("")
            setGlobalSpeciality("")
            setSelectedUf("")
            setLocation("")
            setSpeciality("")
            setRating("")
            setDoctors(doctors)
            setFetchData(true)
          }
        })
    } else {
      setFetchData(true)
    }
  }, [
    globalLocation, globalSpeciality, doctors, setGlobalLocation, setGlobalSpeciality,
    setDoctors, setLocation, setRating, setSelectedUf, setSpeciality
  ])

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
      const states = res.data.map(uf => uf = { 'initial': `${uf.sigla}`, 'name': `${uf.nome}` })
      setUfs(states)
    })
  }, [setUfs])

  useEffect(() => {
    if (selectedUf !== null) {
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf.initial}/municipios`).then(res => {
        const cityNames = res.data.map(city => city.nome)

        setCities(cityNames)
      })
    } else {
      setCities([])
    }
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

  const handleShowAll = () => {
    setFetchData(false)
    firebase.db.collection('doctors').get().then(snapshot => {
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

  //Busca os médicos de acordo com a pesquisa avançada na tela de busca
  const handleAdvancedSearch = () => {
    if (location === "" || speciality === "" || rating === 0) {
      setOpenDialog(true)
    } else {
      setFetchData(false)
      firebase.db.collection('doctors')
        .where("location", "==", location)
        .where("speciality", "==", speciality)
        //.where("price", "<=", price)
        //.where("date", "==", date)
        .where("rating", ">", rating)
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
            <Container>
              <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" gutterBottom>
                Lista de médicos
              </Typography>
              <Typography component="h5" variant="h6" align="center" color="textSecondary" gutterBottom>
                Aqui você pode encontrar todos os profissionais de acordo com a sua pesquisa.
              </Typography>
            </Container>
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
                        getOptionLabel={uf => uf.name}
                        renderOption={(option) => (
                          <React.Fragment>
                            {option.name}
                          </React.Fragment>
                        )}
                        value={selectedUf}
                        onChange={(event, newValue) => {
                          setSelectedUf(newValue)
                          setLocation('')
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
                        disabled={selectedUf === null || selectedUf.length === 0}
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
                      <InputLabel shrink>
                        Avaliação
                       </InputLabel>
                      <Select
                        fullWidth
                        displayEmpty
                        value={rating}
                        onChange={event => setRating(event.target.value)}
                      >
                        <MenuItem value={0} disabled>
                          <em>Escolha uma opção</em>
                        </MenuItem>
                        <MenuItem value={1}>Maior que 1 estrela</MenuItem>
                        <MenuItem value={2}>Maior que 2 estrelas</MenuItem>
                        <MenuItem value={3}>Maior que 3 estrelas</MenuItem>
                        <MenuItem value={4}>Maior que 4 estrelas</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
                <div className={styles.buttons}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAdvancedSearch}
                    className={styles.button}
                    startIcon={<SearchIcon />}
                  >
                    Buscar
                  </Button>
                </div>
              </ExpansionPanel>
              <Grid container className={styles.bar}>
                <Grid>
                  <Typography variant="subtitle1" component="p" gutterBottom>
                    Médicos encontrados ({doctors.length})
                    </Typography>
                </Grid>
                <Grid>
                  <Button size="small" color="primary" onClick={handleShowAll}>
                    Ver todos
                    </Button>
                </Grid>
              </Grid>
              <Divider />
            </Container>
            <Container maxWidth="md" className={styles.alert}>
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
    fontWeight: 'bold',
    color: '#322153',
    fontFamily: 'Ubuntu',
  },
  alert: {
    marginTop: theme.spacing(2)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  bar: {
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  }
}))
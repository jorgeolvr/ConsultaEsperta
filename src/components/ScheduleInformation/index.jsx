import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../../Context'

import axios from 'axios'
import firebase from '../../config/Firebase'

import { Grid, TextField, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

export default function ScheduleInformation() {
  const {
    description, setDescription, city, setCity, speciality, setSpeciality,
    street, setStreet, streetNumber, setStreetNumber, neighbour, setNeighbour, selectedUf, setSelectedUf
  } = useContext(Context)

  const [ufs, setUfs] = useState([])
  const [cities, setCities] = useState([])
  const [specialities, setSpecialities] = useState([])


  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
      const states = res.data.map(uf => uf = { 'initial': `${uf.sigla}`, 'name': `${uf.nome}` })
      setUfs(states)
    })
  }, [])

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


  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} direction="row" >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Informações médicas
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Descrição"
            defaultValue={description}
            onChange={event => setDescription(event.target.value)}
            inputProps={{ maxLength: 45 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Informações do local
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
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
              setCity("")
            }}
            renderInput={(params) => <TextField {...params} label="Estados" variant="standard" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            fullWidth
            options={cities}
            getOptionLabel={cities => cities}
            value={city}
            disabled={selectedUf === null || selectedUf.length === 0}
            onChange={(event, newValue) => {
              setCity(newValue)
            }}
            renderInput={(params) => <TextField {...params} label="Cidades" variant="standard" />}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Rua"
            defaultValue={street}
            onChange={event => setStreet(event.target.value)}
            inputProps={{ maxLength: 50 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Número"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            defaultValue={streetNumber}
            onChange={event => setStreetNumber(event.target.value)}
            inputProps={{ maxLength: 5 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Bairro"
            defaultValue={neighbour}
            onChange={event => setNeighbour(event.target.value)}
            inputProps={{ maxLength: 30 }}
            fullWidth
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
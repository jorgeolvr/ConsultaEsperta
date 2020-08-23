import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../../Context'

import firebase from '../../config/Firebase'

import {
  Grid, FormControl, Select, MenuItem, InputLabel, Checkbox, FormControlLabel,
  InputAdornment, Input
} from '@material-ui/core'

export default function DoctorServiceData() {
  const {
    day, setDay, checked, setChecked, price, setPrice
  } = useContext(Context)

  const [doctorPrice, setDoctorPrice] = useState('Individual')
  const [selectedDays, setSelectedDays] = useState([])


  useEffect(() => {
    firebase.db.collection('doctors').doc(firebase.getId()).get().then(doc => {
      if (doc.exists) {
        const data = doc.data()
        if (data.price !== undefined) {
          setDoctorPrice(data.price)
        }
      }
    })
  })

  useEffect(() => {
    var days = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"]
    firebase.db.collection('doctors').doc(firebase.getId())
      .collection('schedules').get().then(snapshot => {
        if (snapshot) {
          snapshot.forEach(schedule => {
            days = days.filter(day => day !== schedule.data().day)
          })
          setSelectedDays(days)
        }
      })
  })

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Dia da semana</InputLabel>
            <Select
              value={day}
              onChange={event => setDay(event.target.value)}
            >
              {selectedDays.map((selectedDay) => (
                <MenuItem value={selectedDay}>{selectedDay}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Preço</InputLabel>
            <Input
              value={doctorPrice !== "Individual" ? doctorPrice : price}
              disabled={doctorPrice !== "Individual"}
              onChange={doctorPrice !== "Individual" ? setPrice(doctorPrice) : event => setPrice(event.target.value)}
              startAdornment={<InputAdornment position="start">R$</InputAdornment>}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                disabled={doctorPrice !== "Individual"}
                onChange={doctorPrice !== "Individual" ? setChecked(true) : event => setChecked(event.target.checked)}
                defaultChecked
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />}
            label="Usar mesmo preço ao cadastrar novos atendimentos"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
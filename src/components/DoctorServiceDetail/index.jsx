import React, { useContext } from 'react'
import { Context } from '../../Context'

import {
  Grid, FormControl, Select, MenuItem, InputLabel
} from '@material-ui/core'
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import MomentUtils from '@date-io/moment'
import 'moment/locale/pt-br'

export default function DoctorServiceDetail() {
  const {
    duration, setDuration, interval, setInterval,
    beginHour, setBeginHour, endHour, setEndHour
  } = useContext(Context)

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <MuiPickersUtilsProvider utils={MomentUtils} locale="pt-br">
            <TimePicker
              label="Horário de início"
              ampm={false}
              minutesStep={60}
              value={beginHour}
              onChange={setBeginHour}
              cancelLabel="Cancelar"
              fullWidth
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MuiPickersUtilsProvider utils={MomentUtils} locale="pt-br">
            <TimePicker
              label="Horário de término"
              ampm={false}
              minutesStep={60}
              value={endHour}
              onChange={setEndHour}
              cancelLabel="Cancelar"
              fullWidth
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Duração das consultas</InputLabel>
            <Select
              value={duration}
              onChange={event => setDuration(event.target.value)}
            >
              <MenuItem value={0} disabled>
                <em>Escolha uma opção</em>
              </MenuItem>
              <MenuItem value={15}>15 minutos</MenuItem>
              <MenuItem value={20}>20 minutos</MenuItem>
              <MenuItem value={30}>30 minutos</MenuItem>
              <MenuItem value={40}>40 minutos</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Intervalo entre consultas</InputLabel>
            <Select
              value={interval}
              onChange={event => setInterval(event.target.value)}
            >
              <MenuItem value={0}>
                <em>Sem intervalo</em>
              </MenuItem>
              <MenuItem value={5}>5 minutos</MenuItem>
              <MenuItem value={10}>10 minutos</MenuItem>
              <MenuItem value={15}>15 minutos</MenuItem>
              <MenuItem value={20}>20 minutos</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
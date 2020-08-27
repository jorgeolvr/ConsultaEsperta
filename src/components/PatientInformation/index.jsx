import React, { useContext } from 'react'
import { Context } from '../../Context'

import InputMask from 'react-input-mask'
import firebase from '../../config/Firebase'

import { Grid, TextField } from '@material-ui/core'

export default function PatientInformation() {
  const { cpf, phone, setCpf, setPhone } = useContext(Context)

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome completo"
            disabled
            defaultValue={firebase.getUsername()}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Endereço de e-mail"
            disabled
            defaultValue={firebase.getEmail()}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputMask mask="999.999.999-99" defaultValue={cpf} onChange={event => setCpf(event.target.value)}  >
            {() => <TextField label='CPF' fullWidth />}
          </InputMask>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputMask mask="(99) 99999-9999" defaultValue={phone} onChange={event => setPhone(event.target.value)}>
            {() => <TextField label='Telefone' fullWidth />}
          </InputMask>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
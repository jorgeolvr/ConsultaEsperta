import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../Context'

import InputMask from 'react-input-mask'
import firebase from '../../config/Firebase'

import { Grid, TextField, CircularProgress } from '@material-ui/core'

export default function PatientInformation() {
  const [fetchData, setFetchData] = useState(true)
  //const { cpf, setCpf, phone, setPhone } = useContext(Context)
  const {
    cpf, phone,
    setCpf, setPhone, setType, setCardName,
    setCardNumber, setExpireDate, setSecurityCode
  } = useContext(Context)

  /*useEffect(() => {
    firebase.db.collection('users').doc(firebase.getId()).get().then(function (doc) {
      if (!doc.exists) {
        setCpf('')
        setPhone('')
        setType('')
        setCardName('')
        setCardNumber('')
        setExpireDate('')
        setSecurityCode('')
        setFetchData(true)
      }
    })
  }, []) */

  return fetchData === true ? (
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
  ) : <div id="loader"><CircularProgress /></div>
}
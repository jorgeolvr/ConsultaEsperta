import React, { useContext } from 'react'
import { Context } from '../../Context'

import InputMask from 'react-input-mask'

import { Grid, TextField } from '@material-ui/core';

export default function PaymentInformation() {
  const { cardName, cardNumber, expireDate, securityCode, setCardName,
    setCardNumber, setExpireDate, setSecurityCode } = useContext(Context)

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Dono do cartão"
            defaultValue={cardName}
            onChange={event => setCardName(event.target.value)}
            inputProps={{ maxLength: 19 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputMask mask="9999 9999 9999 9999" defaultValue={cardNumber} onChange={event => setCardNumber(event.target.value)}>
            {() => <TextField label="Número do cartão" fullWidth />}
          </InputMask>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputMask mask="99/99" defaultValue={expireDate} onChange={event => setExpireDate(event.target.value)}>
            {() => <TextField label="Data de expiração" fullWidth />}
          </InputMask>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputMask mask="999" defaultValue={securityCode} onChange={event => setSecurityCode(event.target.value)}>
            {() => <TextField
              id="cvv"
              label="CVV"
              helperText="Os últimos três dígitos atrás do cartão"
              fullWidth
            />}
          </InputMask>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
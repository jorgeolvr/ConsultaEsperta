import React, { useContext } from 'react'
import { Context } from '../../Context'

import { Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import firebase from '../../config/Firebase'

export default function PatientReview() {
  const styles = useStyles();
  const { cpf, phone, cardName, cardNumber, brand, setBrand, expireDate, securityCode } = useContext(Context)
  const lastDigitsCard = cardNumber.split(" ")[3]

  if (cardNumber.substring(0, 1) === "3") {
    setBrand("American Express")
  } else if (cardNumber.substring(0, 1) === "4") {
    setBrand("Visa")
  } else if (cardNumber.substring(0, 1) === "5") {
    setBrand("MasterCard")
  } else if (cardNumber.substring(0, 1) === "6") {
    setBrand("Discover")
  } else {
    setBrand("Não identificado")
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={styles.title}>
            Dados Pessoais
                    </Typography>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Nome:</Typography>
            <Typography gutterBottom>{firebase.getUsername()}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>CPF:</Typography>
            <Typography gutterBottom>{cpf}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Telefone:</Typography>
            <Typography gutterBottom>{phone}</Typography>
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={styles.title}>
            Forma de Pagamento
                    </Typography>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Bandeira:</Typography>
            <Typography gutterBottom>{brand}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Dono do Cartão:</Typography>
            <Typography gutterBottom>{cardName}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Número do Cartão:</Typography>
            <Typography gutterBottom>Final {lastDigitsCard}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Expirado em: </Typography>
            <Typography gutterBottom>{expireDate}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>CVV: </Typography>
            <Typography gutterBottom>{securityCode}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
  },
  typography: {
    fontWeight: 'bold',
    marginRight: 5
  }
}));

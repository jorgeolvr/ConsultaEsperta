import React, { useContext } from 'react'
import { Context } from '../../Context'

import { Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import firebase from '../../config/Firebase'

export default function DoctorReview() {
  const styles = useStyles();
  const { crm, cpf, phone, description, speciality, city, street, streetNumber, neighbour } = useContext(Context)
  //const finalAddress = `${address}, ${addressNumber} - ${neighbour}`

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" className={styles.title} gutterBottom>
            Informações do atendimento
          </Typography>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Descrição:</Typography>
            <Typography gutterBottom>{description}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Especialidade:</Typography>
            <Typography gutterBottom>{speciality}</Typography>
          </Grid>
        </Grid>
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
            <Typography className={styles.typography} gutterBottom>CRM:</Typography>
            <Typography gutterBottom>{crm}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Telefone:</Typography>
            <Typography gutterBottom>{phone}</Typography>
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={styles.title}>
            Informações do local
          </Typography>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Cidade:</Typography>
            <Typography gutterBottom>{city}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Rua:</Typography>
            <Typography gutterBottom>{street}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Número:</Typography>
            <Typography gutterBottom>{streetNumber}</Typography>
          </Grid>

          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Bairro:</Typography>
            <Typography gutterBottom>{neighbour}</Typography>
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

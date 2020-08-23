import React, { useContext } from 'react'
import { Context } from '../../Context'

import { Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

export default function DoctorServiceReview() {
  const styles = useStyles()

  const {
    day, beginHour, endHour, price,
    duration, interval
  } = useContext(Context)

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={styles.title}>
            Dados de atendimento
          </Typography>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Dia da semana:</Typography>
            <Typography gutterBottom>{day}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Preço:</Typography>
            <Typography gutterBottom>R$ {price}</Typography>
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={styles.title}>
            Detalhes de atendimento
          </Typography>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Duração:</Typography>
            <Typography gutterBottom>
              {duration} minutos
            </Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Intervalo:</Typography>
            <Typography gutterBottom>
              {interval === 0 ? "Sem intervalo" : `${interval} minutos`}
            </Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Horário de início:</Typography>
            <Typography gutterBottom>{beginHour.format('LT')}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>Horário de término:</Typography>
            <Typography gutterBottom>{endHour.format('LT')}</Typography>
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

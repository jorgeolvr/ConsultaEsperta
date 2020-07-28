import React from 'react'

import { Container, Typography, Grid, Card, CardHeader, CardContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import undrawPair from '../../assets/undraw_pair_programming_njlp.svg'
import undrawSchedule from '../../assets/undraw_schedule_pnbk.svg'
import undrawDoctor from '../../assets/undraw_doctor_kw5l.svg'

export default function HowToUse() {
  const styles = useStyles();

  const helpers = [
    {
      title: 'Procure médicos',
      subDescription: ['Realize uma pesquisa', 'Confira as avaliações', 'Veja o perfil do médico'],
      image: `${undrawPair}`
    },
    {
      title: 'Marque consultas',
      subDescription: ['Escolha um horário', 'Visualize sua agenda', 'Confirme sua presença'],
      image: `${undrawSchedule}`
    },
    {
      title: 'Seja atendido',
      subDescription: ['Compareça no local', 'Converse com o médico', 'Avalie com uma nota'],
      image: `${undrawDoctor}`
    },
  ];

  return (
    <React.Fragment>
      <Container maxWidth="sm" component="main" className={styles.container}>
        <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
          Como funciona?
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" component="p">
          Consulta Esperta é um marketplace na área da saúde, provendo um ambiente
          para que profissionais possam difundir e cobrar por seus serviços.
        </Typography>
      </Container>
      <Container className={styles.instructions} maxWidth="md" component="main">
        <Grid container spacing={2} alignItems="flex-end">
          {helpers.map(helper => (
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader
                  title={helper.title}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={styles.cardHeader}
                />
                <CardContent>
                  {/*<div className={styles.cardContent}>
                                        <Typography component="h4" variant="h5" color="textPrimary">
                                            {helper.description}
                                        </Typography>
                                    </div>*/}
                  <ul>
                    {helper.subDescription.map(line => (
                      <Typography component="li" color="textSecondary" variant="subtitle1" align="center" key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                  <Grid align="center" className={styles.image}>
                    <img src={helper.image} alt="Imagem" height="150rem" />
                  </Grid>
                </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  mainTitle: {
    fontWeight: 'bold'
  },
  container: {
    padding: theme.spacing(6, 0, 6)
  },
  image: {
    marginTop: theme.spacing(3)
  },
  instructions: {
    marginBottom: theme.spacing(5)
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2)
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
}))
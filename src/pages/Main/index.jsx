import React, { createRef } from 'react'
import Header from '../../components/MainHeader'
import HowToUse from '../../components/HowToUse'
import Footer from '../../components/Footer'

import { Grid, Container, CssBaseline, Typography, Button, Divider } from '@material-ui/core'
import { ArrowDownward } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import logo from '../../assets/logo-cropped.png'
import medicine from '../../assets/medicine.svg'

export default function Main() {
  const styles = useStyles();
  const ref = createRef();

  const handleScroll = () => ref.current.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })

  return (
    <React.Fragment>
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <Header />
          </Container>
        </Grid>
        <Container className={styles.mainContainer} maxWidth="md" component="main">
          <Grid container >
            <Grid item xs={12} md={6} className={styles.grid}>
              <img src={logo} alt="Consulta Esperta" height="80em" />
              <Typography className={styles.mainTitle} component="h3" variant="h4" color="textPrimary" gutterBottom>
                Seu marketplace de consultas médicas
              </Typography>
              <Typography component="h5" variant="h6" color="textSecondary" gutterBottom>
                Ajudamos as pessoas a encontrar profissionais especializados por meio de recomendações.
              </Typography>
              <Grid className={styles.information} container>
                <Grid item xs={12} sm={6}>
                  <Grid container direction="row">
                    <Button startIcon={<ArrowDownward />} color="primary" variant="text" onClick={handleScroll}>
                      Veja mais abaixo
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <img src={medicine} alt="Imagem" className={styles.img} height="300em" width="100%" />
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Divider />
      <Container ref={ref}>
        <HowToUse />
      </Container>
      <Divider />
      <Footer />
    </React.Fragment >
  )
}

const useStyles = makeStyles(theme => ({
  mainGrid: {
    backgroundColor: '#F5FFFA',
    minHeight: '100vh',
  },
  mainContainer: {
    marginTop: 50
  },
  grid: {
    marginTop: 20
  },
  mainTitle: {
    marginTop: 30,
    fontWeight: 700
  },
  information: {
    marginTop: 50,
    marginBottom: 50
  },
  typography: {
    fontWeight: 'bold'
  },
  img: {
    marginBottom: theme.spacing(2)
  },
}))
import React from 'react'
import { Link, Typography } from '@material-ui/core'

export default function Copyright() {
  return <Typography variant="body2" color="inherit" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://github.com/jorgeolvr">
      Jorge Oliveira
        </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
}
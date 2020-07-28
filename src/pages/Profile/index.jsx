import React, { useState, useEffect } from 'react'

import { CircularProgress } from '@material-ui/core'

import firebase from '../../config/Firebase'

export default function Profile({ history }) {
  const [type, setType] = useState('')
  const [fetchData, setFetchData] = useState(false)


  useEffect(() => {
    firebase.db.collection('users').doc(firebase.getId()).get().then(function (doc) {
      if (doc.exists) {
        const { type } = doc.data()
        setType(type)
        setFetchData(true)
      }
    })
  }, [])

  console.log(type)

  return fetchData === true ? (
    <React.Fragment>
      {type === "Paciente" ? history.push('/patient/view') : history.push('/doctor/view')}
    </React.Fragment>
  ) : <div id="loader"><CircularProgress /></div>
}
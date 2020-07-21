import React, { useState, useEffect } from 'react'

import { CircularProgress } from '@material-ui/core'

import firebase from '../../config/Firebase'

export default function ViewProfile({ history }) {
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
      {type === "Paciente" ? history.push('/viewpatient') : history.push('/viewdoctor')}
    </React.Fragment>
  ) : <div id="loader"><CircularProgress /></div>
}
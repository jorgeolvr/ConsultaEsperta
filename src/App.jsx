import React, { useState, useEffect } from 'react'
import './App.css';
import { CircularProgress } from '@material-ui/core'

import firebase from './config/Firebase'
import Routes from './Routes'

export default function App() {
	const [firebaseInitialized, setFirebaseInitialized] = useState(false)

	useEffect(() => {
		firebase.isInitialized().then(val => {
			setFirebaseInitialized(val)
		})
	})

	return firebaseInitialized !== false ? (
		<Routes />
	) : <div id="loader"><CircularProgress /></div>
}

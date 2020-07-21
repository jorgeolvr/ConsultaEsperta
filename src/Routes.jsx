import React, { useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Main from './pages/Main'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ViewProfile from './pages/ViewProfile'
import DoctorProfile from './pages/DoctorProfile'
import PatientProfile from './pages/PatientProfile'
import ViewPatient from './pages/ViewPatient'
import ViewDoctor from './pages/ViewDoctor'
import Forgot from './pages/Forgot'
import Search from './pages/Search'
import Doctor from './pages/Doctor'
import Schedule from './pages/Schedule'
import Confirmed from './pages/Confirmed'
import Cancelled from './pages/Cancelled'

import { UserContext } from './UserContext'

export default function Routes() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [crm, setCrm] = useState('')
  const [street, setStreet] = useState('')
  const [streetNumber, setStreetNumber] = useState('')
  const [neighbour, setNeighbour] = useState('')
  const [selectedUf, setSelectedUf] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [brand, setBrand] = useState('')
  const [expireDate, setExpireDate] = useState('')
  const [securityCode, setSecurityCode] = useState('')
  const [location, setLocation] = useState('')
  const [globalLocation, setGlobalLocation] = useState('')
  const [globalSpeciality, setGlobalSpeciality] = useState('')
  const [price, setPrice] = useState(0)
  const [rating, setRating] = useState(0)
  const [date, setDate] = useState("")

  const user = {
    cpf, setCpf, crm, setCrm, description, setDescription, city, setCity, streetNumber, setStreetNumber, neighbour, setNeighbour,
    speciality, setSpeciality, phone, setPhone, type, setType, cardName, setCardName, cardNumber,
    setCardNumber, brand, setBrand, expireDate, setExpireDate, securityCode,
    setSecurityCode, location, setLocation, globalLocation,
    setGlobalLocation, globalSpeciality, setGlobalSpeciality, price, setPrice,
    rating, setRating, date, setDate, selectedUf, setSelectedUf, street, setStreet,
    name, setName, email, setEmail
  }

  return (
    <BrowserRouter>
      <Switch>
        <UserContext.Provider value={user}>
          <Route path="/" exact component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/home" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/doctor/:id" component={Doctor} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/confirmed" component={Confirmed} />
          <Route path="/cancelled" component={Cancelled} />
          <Route path="/doctorprofile" component={DoctorProfile} />
          <Route path="/patientprofile" component={PatientProfile} />
          <Route path="/viewprofile" component={ViewProfile} />
          <Route path="/viewpatient" component={ViewPatient} />
          <Route path="/viewdoctor" component={ViewDoctor} />
        </UserContext.Provider>
      </Switch>
    </BrowserRouter>
  )
}
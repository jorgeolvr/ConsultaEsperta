import React, { useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Main from './pages/Main'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import DoctorProfile from './pages/DoctorProfile'
import PatientProfile from './pages/PatientProfile'
import ViewPatient from './pages/PatientView'
import ViewDoctor from './pages/DoctorView'
import Forgot from './pages/Forgot'
import Search from './pages/Search'
import Doctor from './pages/Doctor'
import Schedule from './pages/Schedule'
import CreateSchedule from './pages/CreateSchedule'

import { Context } from './Context'

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
  const [doctors, setDoctors] = useState([])
  const [price, setPrice] = useState(0)
  const [rating, setRating] = useState('')
  const [date, setDate] = useState('')

  const context = {
    cpf, setCpf, crm, setCrm, description, setDescription, city, setCity, streetNumber,
    setStreetNumber, neighbour, setNeighbour, speciality, setSpeciality, phone, setPhone,
    type, setType, cardName, setCardName, cardNumber, setCardNumber, brand, setBrand,
    expireDate, setExpireDate, securityCode, setSecurityCode, location, setLocation,
    globalLocation, setGlobalLocation, globalSpeciality, setGlobalSpeciality, price,
    setPrice, rating, setRating, date, setDate, selectedUf, setSelectedUf, street,
    setStreet, name, setName, email, setEmail, doctors, setDoctors
  }

  return (
    <BrowserRouter>
      <Switch>
        <Context.Provider value={context}>
          <Route path="/" exact component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/home" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/doctor/:id" component={Doctor} />
          <Route path="/create" component={CreateSchedule} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/doctor/profile" component={DoctorProfile} />
          <Route path="/patient/profile" component={PatientProfile} />
          <Route path="/profile" component={Profile} />
          <Route path="/patient/view" component={ViewPatient} />
          <Route path="/doctor/view" component={ViewDoctor} />
        </Context.Provider>
      </Switch>
    </BrowserRouter>
  )
}
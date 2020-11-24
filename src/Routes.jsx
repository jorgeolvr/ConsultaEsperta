import React, { useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import moment from 'moment'
import 'moment/locale/pt-br'

import Main from './pages/Main'
import Login from './pages/Login'
import Setting from './pages/Setting'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Doctor from './pages/Doctor'
import Patient from './pages/Patient'
import Forgot from './pages/Forgot'
import Search from './pages/Search'
import Detail from './pages/Detail'
import Schedule from './pages/Schedule'
import Service from './pages/Service'
import Rating from './pages/Rating'
import Form from './pages/Form'
import Symptom from './pages/Symptom'
import Result from './pages/Result'

import { Context } from './Context'

export default function Routes() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [crm, setCrm] = useState('')
  const [street, setStreet] = useState('')
  const [streetNumber, setStreetNumber] = useState('')
  const [neighbour, setNeighbour] = useState('')
  const [selectedUf, setSelectedUf] = useState([])
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
  const [price, setPrice] = useState('')
  const [rating, setRating] = useState(0)
  const [date, setDate] = useState('')
  const [day, setDay] = useState('')
  const [beginHour, setBeginHour] = useState(moment().set({ minute: 0 }))
  const [endHour, setEndHour] = useState(moment().set({ minute: 0 }))
  const [duration, setDuration] = useState(0)
  const [interval, setInterval] = useState(0)
  const [checked, setChecked] = React.useState(false)
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [selectedHomeUf, setSelectedHomeUf] = useState([])

  const context = {
    cpf, setCpf, crm, setCrm, description, setDescription, city, setCity, streetNumber,
    setStreetNumber, neighbour, setNeighbour, speciality, setSpeciality, phone, setPhone,
    type, setType, cardName, setCardName, cardNumber, setCardNumber, brand, setBrand,
    expireDate, setExpireDate, securityCode, setSecurityCode, location, setLocation,
    globalLocation, setGlobalLocation, globalSpeciality, setGlobalSpeciality, price,
    setPrice, rating, setRating, date, setDate, selectedUf, setSelectedUf, street,
    setStreet, name, setName, email, setEmail, doctors, setDoctors, day, setDay,
    beginHour, setBeginHour, endHour, setEndHour, checked, setChecked,
    duration, setDuration, interval, setInterval, selectedSymptoms, setSelectedSymptoms,
    selectedHomeUf, setSelectedHomeUf
  }

  return (
    <BrowserRouter>
      <Switch>
        <Context.Provider value={context}>
          <Route path="/" exact component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/setting" component={Setting} />
          <Route path="/register" component={Register} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/home" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/detail" component={Detail} />
          <Route path="/service" component={Service} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/doctor" component={Doctor} />
          <Route path="/patient" component={Patient} />
          <Route path="/profile" component={Profile} />
          <Route path="/rating" component={Rating} />
          <Route path="/form" component={Form} />
          <Route path="/symptom" component={Symptom} />
          <Route path="/result" component={Result} />
        </Context.Provider>
      </Switch>
    </BrowserRouter>
  )
}
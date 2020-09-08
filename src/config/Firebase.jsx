import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'

class Firebase {

  constructor() {
    app.initializeApp(config)
    this.auth = app.auth()
    this.db = app.firestore()
  }

  isInitialized() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve)
    })
  }

  getId() {
    return this.auth.currentUser && this.auth.currentUser.uid
  }

  getUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName
  }

  getEmail() {
    return this.auth.currentUser && this.auth.currentUser.email
  }

  resetPassword(emailAddress) {
    this.auth.sendPasswordResetEmail(emailAddress)
  }

  userDatabase(name, email, cpf, phone, type) {
    const userId = this.getId()
    const usersRef = this.db.collection('users').doc(userId)

    usersRef.get().then(doc => {
      if (doc.exists) {
        usersRef.update({
          name: name,
          email: email,
          cpf: cpf,
          type: type,
          phone: phone
        })
      } else {
        usersRef.set({
          name: name,
          email: email,
          cpf: cpf,
          type: type,
          phone: phone
        })
      }
    })
  }

  doctorDatabase(name, crm, description, state, location, speciality, street, number, neighbour, rating) {
    const userId = this.getId()
    const doctorsRef = this.db.collection('doctors').doc(userId)

    // Passando imagem hardcode por enquanto
    const image = 'https://firebasestorage.googleapis.com/v0/b/consulta-esperta-app.appspot.com/o/doctor2.jpg?alt=media&token=ae6010ba-110a-499e-ba29-aa0723cca291';

    doctorsRef.get().then(doc => {
      if (doc.exists) {
        doctorsRef.update({
          name: name,
          street: street,
          number: number,
          neighbour: neighbour,
          crm: crm,
          description: description,
          state: state,
          location: location,
          speciality: speciality,
          image: image
        })
      } else {
        doctorsRef.set({
          name: name,
          street: street,
          number: number,
          neighbour: neighbour,
          crm: crm,
          description: description,
          state: state,
          location: location,
          speciality: speciality,
          image: image,
          rating: 0
        })
      }
    })
  }

  changePassword(password) {
    var user = this.auth().currentUser
    user.updatePassword(password)
  }

  deleteUser() {
    //const userId = this.getId()
    //this.db.collection('users').doc(userId).delete()
    this.auth().currentUser.delete()
  }

  patientDatabase(name, cardName, cardNumber, brand, expireDate, securityCode, rating) {
    const userId = this.getId()
    const patientRef = this.db.collection('patients').doc(userId)

    patientRef.get().then(doc => {
      if (doc.exists) {
        patientRef.update({
          name: name,
          cardName: cardName,
          number: cardNumber,
          brand: brand,
          expireDate: expireDate,
          securityCode: securityCode,
        })
      } else {
        patientRef.set({
          name: name,
          cardName: cardName,
          number: cardNumber,
          brand: brand,
          expireDate: expireDate,
          securityCode: securityCode,
          rating: 0
        })
      }
    })
  }

  deletePayment() {
    const userId = this.getId()
    this.db.collection('payments').doc(userId).delete()
  }

  async register(name, lastName, email, password) {
    const fullName = name + " " + lastName
    await this.auth.createUserWithEmailAndPassword(email, password).then(() => {
      return this.auth.currentUser.updateProfile({
        displayName: fullName,
        email: email,
      })
    })
  }

  async login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  async loginFacebook() {
    var provider = new app.auth.FacebookAuthProvider()
    await this.auth.signInWithPopup(provider)
  }

  async loginGoogle() {
    var provider = new app.auth.GoogleAuthProvider()
    await this.auth.signInWithPopup(provider)
  }


  logout() {
    return this.auth.signOut()
  }
}

const config = {
  apiKey: "AIzaSyDvsJJB2ZvgLuw-92X4dKfGic8URQeVFcA",
  authDomain: "consulta-esperta-app.firebaseapp.com",
  databaseURL: "https://consulta-esperta-app.firebaseio.com",
  projectId: "consulta-esperta-app",
  storageBucket: "consulta-esperta-app.appspot.com",
  messagingSenderId: "413988909663",
  appId: "1:413988909663:web:df68449721e11f51c261ea",
};

export default new Firebase()



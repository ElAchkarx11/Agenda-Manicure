import { useState } from 'react'

import { Link } from 'react-router-dom'
import { auth } from '../../firebaseConnection'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (email !== '' && password !== '') {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/admin', { replace: true })
        })
        .catch(() => {
          console.log("ERRO AO FAZER O CADASTRO")
        })


    } else {
      alert("Preencha todos os campos!")
    }


  }


  return (
    <div className="container">
      <div className="row  justify-content-center text-center">

        <h1 className='text-center'>Cadastre-se</h1>
        <span className='text-center'>Vamos criar sua conta!</span>

        <div className='col-7 d-flex justify-content-center pt-4'>
          <form className="form" onSubmit={handleRegister}>
            <input
              id='email-input'
              type="text"
              placeholder="Digite seu email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              id='senha-input'
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button id='btn-cadastrar' type="submit" >Cadastrar</button>
          </form>
        </div>
        <Link id='login-link' className="button-link text-center pt-4" to="/">
          Já possui uma conta? Faça login!
        </Link>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import './admin.css'
import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom'
import { PlusSquare } from 'react-bootstrap-icons'




import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore'

export default function Admin() {
  const [nomeInput, setNomeInput] = useState('')
  const [user, setUser] = useState({})

  const [funcao, setFuncao] = useState([]);

  const [edit, setEdit] = useState({})
  const navigate = useNavigate();

  /* const [value, onChange] = useState(new Date()); */

  const [nome, setNome] = useState([]);

  const [horaInput, setHoraInput] = useState([]);

  /* const [clienteInput, setClienteInput] = useState('') */
  const [clienteSelect, setClienteSelect] = useState('')

  const [preco, setpreco] = useState('')


  useEffect(() => {
    async function loadTarefas() {
      const userDetail = localStorage.getItem("@detailUser")
      setUser(JSON.parse(userDetail))

      if (userDetail) {
        const data = JSON.parse(userDetail);

        const tarefaRef = collection(db, "tarefas")
        const q = query(tarefaRef, where("userUid", "==", data?.uid))

        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              hora: doc.data().hora,
              nome: doc.data().nome,
              preco: doc.data().preco,
              funcao: doc.data().funcao,
              userUid: doc.data().userUid,
            })
          })

          setNome(lista);


        })

      }

    }

    loadTarefas();
  }, [])

  useEffect(() => {
    async function loadFuncoes() {
      const userDetail = localStorage.getItem("@detailUser")
      const data = JSON.parse(userDetail);
      const funcoesRef = collection(db, "funcoes")


      const unsub = onSnapshot(funcoesRef, (snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            funcao: doc.data().funcao
          })
        })

        setFuncao(lista);


      })



    }

    loadFuncoes();
  }, [])


  async function handleRegister(e) {
    e.preventDefault();

    if (nomeInput === '') {
      alert("Digite sua tarefa...")
      return;
    }

    if (edit?.id) {
      handleUpdateTarefa();
      return;
    }


    await addDoc(collection(db, "tarefas"), {
      nome: nomeInput,
      hora: horaInput,
      preco: preco + "R$",
      funcao: clienteSelect,
      created: new Date(),
      userUid: user?.uid

    })
      .then(() => {
        console.log("TAREFA REGISTRADA")
        setNomeInput('')
        setHoraInput('')
        setClienteSelect('')
        setpreco('')
        setEdit({})
      })
      .catch((error) => {
        console.log("ERRO AO REGISTRAR " + error)
      })


  }

  async function handleLogout() {
    await signOut(auth);
  }



  async function deleteTarefa(id) {
    const docRef = doc(db, "tarefas", id)
    await deleteDoc(docRef)
  }

  function editTarefa(item) {
    setNomeInput(item.nome)
    setEdit(item);
  }


  async function handleUpdateTarefa() {
    const docRef = doc(db, "tarefas", edit?.id)
    await updateDoc(docRef, {
      nome: nomeInput,
      hora: horaInput,
      preco: preco + "R$",
      funcao: clienteSelect
    })
      .then(() => {
        console.log("TAREFA ATUALIZADA")
        setNomeInput('')
        setHoraInput('')
        setClienteSelect('')
        setpreco('')
        setEdit({})
      })
      .catch(() => {
        console.log("ERRO AO ATUALIZAR")
        setNomeInput('')

        setEdit({})
      })
  }


  /*  HTML da página principal */
  return (
    <div className='container-fluid'>

      <h1 className='text-center'>Manicure</h1>

      <div className='row justify-content-center'>

        <div className='d-flex justify-content-center'>

          <form className="form" onSubmit={handleRegister}>
            <input
              id='cliente-input'
              className='form-control'
              placeholder="Digite o nome do cliente..."
              value={nomeInput}
              onChange={(e) => setNomeInput(e.target.value)}
            />

            <input
              id='preco-input'
              className='form-control'
              placeholder="Digite o preço..."
              value={preco}
              onChange={(e) => setpreco(e.target.value)}
            />

            {/* Seleção de opções de serviços */}


            <div class="input-group">

              <select id='servico-select' className='form-control' value={clienteSelect} onChange={(e) => setClienteSelect(e.target.value)}>

                <option value="">Selecione um serviço</option>
                {funcao.map((item) => (

                  <option key={item.id} value={item.funcao}>{item.funcao}</option>

                ))}

              </select>
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon3">
                  <Link id='task-register' className="" to="/task_Register">
                    <PlusSquare />
                  </Link></span>
              </div>
            </div>


            {/* Registro de novas opções de serviços */}



            {/* Seleção de horários */}
            <select id='horario-select' className='form-control' value={horaInput} onChange={(e) => setHoraInput(e.target.value)}>
              <option value="">Selecione o horário</option>
              <option value="8:00">8:00</option>
              <option value="9:00">9:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
            </select>



            {Object.keys(edit).length > 0 ? (
              <button id='btn-atualizar' className="btn btn-primary" type="submit">Atualizar tarefa</button>
            ) : (
              <button id='btn-registrar' className="btn btn-primary" type="submit">Registrar tarefa</button>
            )}
          </form>
        </div>

        <div className='mt-4 d-flex justify-content-center'>
          {nome.map((item) => (
            <article key={item.id} className="list">
              <p>Nome do cliente: {item.nome}</p>
              <p>Preço: {item.preco}</p>
              <p>Horário marcado: {item.hora}</p>
              <p>Descrição: {item.funcao}</p>

              <div id='btn-block'>
                <button id='btn-editar' className='btn btn-outline-primary' onClick={() => editTarefa(item)}>Editar</button>
                <button id='btn-concluir' className="btn btn-outline-warning" onClick={() => deleteTarefa(item.id)} >Concluir</button>
              </div>


            </article>
          ))}
        </div>



        <div className='fixed-bottom col-2 m-5'>
          <button id='btn-logout' className="btn btn-outline-danger" onClick={handleLogout}>Sair</button>
        </div>

      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom'
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

export default function Task_Register() {

    const [funcaoInput, setfuncaoInput] = useState('');
    const [funcao, setFuncao] = useState([]);
    const [edit, setEdit] = useState({})

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

    async function handleRegisterFunction(e) {
        e.preventDefault();

        if (funcaoInput === '') {
            alert('Digite a função que deseja...')
            return;
        }

        if (edit?.id) {
            handleUpdateFunction();
            return;
        }



        await addDoc(collection(db, "funcoes"), {
            funcao: funcaoInput
        })
            .then(() => {
                console.log("Função registrada");
                setfuncaoInput('');
            })
            .catch((error) => {
                console.log("Erro ao registrar" + error)
            })

    }

    async function deleteFunction(id) {
        const docRef = doc(db, "funcoes", id)
        await deleteDoc(docRef)
    }

    function editFunction(item) {
        setfuncaoInput(item.funcao)
        setEdit(item);
    }


    async function handleUpdateFunction() {
        const docRef = doc(db, "funcoes", edit?.id)
        await updateDoc(docRef, {
            funcao: funcaoInput
        })
            .then(() => {
                console.log('Tarefa atualizada')
                setfuncaoInput('');
                setEdit({})
            })
            .catch(() => {
                console.log("Erro ao atualizar")
                setfuncaoInput('')

                setEdit({})
            })
    }


    return (
        <>
            <div className='container-fluid'>
                <h1 className='text-center p-4'>Registrar funções</h1>
                <div className='row justify-content-center'>
                    <div className='col-6 d-flex justify-content-center'>
                        <form className='form' onSubmit={handleRegisterFunction}>
                            <input
                                id='funcao-input'
                                className='form-control'
                                placeholder='Digite a nova função...'
                                value={funcaoInput}
                                onChange={(e) => setfuncaoInput(e.target.value)} />

                            {Object.keys(edit).length > 0 ? (
                                <button id='btn-atualizar' className="btn btn-warning" type="submit">Atualizar tarefa</button>
                            ) : (
                                <button id='btn-registrar' className="btn btn-primary" type="submit">Registrar tarefa</button>
                            )}


                        </form>
                    </div>
                    <h3 className='text-center p-4'>Funções Registradas</h3>

                    <div className='col-4'>
                        {funcao.map((item) => (
                            <article key={item.id}>
                                <div className='m-1 p-4 bg-white'>
                                    <h4>{item.funcao}</h4>
                                    <button id='btn-editar' className='btn btn-outline-primary mx-1' onClick={() => editFunction(item)}>Editar</button>
                                    <button id='btn-excluir' className="btn btn-outline-danger" onClick={() => deleteFunction(item.id)} >Excluir</button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            <div className='fixed-top'>
                <Link id='home-link' className="btn btn-outline-primary m-4" to="/admin">
                    Voltar para a Home
                </Link>
            </div>


        </>
    )
}
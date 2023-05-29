import { Routes, Route} from 'react-router-dom'

import Home from '../pages/Home';
import Register from '../pages/Register';
import Task_Register from '../pages/Task_Register';
import Admin from '../pages/Admin'

import Private from './Private'

function RoutesApp(){
  return(
    <Routes>
      
      <Route path='/' element={ <Home/> } />
      <Route path='/register' element={ <Register/> } />
      <Route path='/task_register' element={ <Task_Register/>}/>
      <Route path='/admin' element={ <Private> <Admin/> </Private> } />
    </Routes>
  )
}

export default RoutesApp;
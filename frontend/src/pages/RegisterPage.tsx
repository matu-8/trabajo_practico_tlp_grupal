
import { useNavigate } from "react-router"
import { registrarUsuarioMock, registrosValidos } from "../mockdata"
import { useState } from "react"

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
 //custom hook
  const handleSubmit = (e) => {   registrarUsuarioMock({name, email, password})
    e.preventDefault();
  }

  return (<>
    {/*el evento onSubmit queda capturado por la funcion, pero la misma no se ejcuta aun*/}
    <form onSubmit={handleSubmit} >
      <h1>Registro</h1>
      <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="nombre" className=""></input>
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="email"></input>
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password"></input>
      <button type="submit">Registrar</button>
    </form>

<button type="button" onClick={()=> navigate('/Login')}>¿Ya tiene cuenta? inicie sesión</button>
  </>)
}

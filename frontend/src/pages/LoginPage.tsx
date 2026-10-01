
import { loginUsuarioMock, registrosValidos } from "../mockdata"
import { useState } from "react"

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 //custom hook
  const handleSubmit = (e) => {
    // loginUsuarioMock({email, password})
    e.preventDefault();

  }

  return (<>
    {/*el evento onSubmit queda capturado por la funcion, pero la misma no se ejcuta aun*/}
    <form onSubmit={handleSubmit} >
      <h1>Inicio de sesion</h1>
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="email"></input>
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password"></input>
      <button type="submit">Iniciar Sesion</button>
    </form>
  </>)
}

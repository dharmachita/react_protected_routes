import { Link,useNavigate } from "react-router-dom"
import GetUsers from "../components/GetUsers"

const Usuarios = () => {
    const navigate=useNavigate();

    const handleNuevoUsuario=()=>{
        navigate('/configuraciones/usuarios/formulario', { state: {  }, replace: true });    
    }
    return (
        <section className="detalle-venta">
            <h1>Usuarios</h1>
            <br />
            <div><button onClick={(handleNuevoUsuario)}>Nuevo Usuario</button></div>
            <br />
            <GetUsers />
            <br />
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    )
}

export default Usuarios
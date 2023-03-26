import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const Home = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        setAuth({});
        navigate('/login');
    }

    return (
        <section>
            <h1>Menú</h1>
            <br />
            <Link to="/clientes">Clientes</Link>
            <br />
            <Link to="/productos">Productos</Link>
            <br />
            <Link to="/ventas">Ventas</Link>
            <br />
            <Link to="/configuraciones">Configuraciones</Link>
            <br />
            <Link to="/users">Users</Link>
            <br />
            <div className="flexGrow">
                <button onClick={logout}>Cerrar Sesión</button>
            </div>
        </section>
    )
}

export default Home

import { Link } from "react-router-dom"
import GetUsers from "../components/GetUsers"

const Configuraciones = () => {
    return (
        <section>
            <h1>Usuarios</h1>
            <br />
            <GetUsers />
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    )
}

export default Configuraciones
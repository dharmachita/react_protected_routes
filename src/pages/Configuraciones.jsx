import { Link } from "react-router-dom"

const Configuraciones = () => {
    return (
        <section>
            <h1>Configuraciones</h1>
            <br />
            <div>
                <Link to="categorias">Crear Categoría</Link>
                <br />
                <Link to="usuarios">Usuarios</Link>
                <br />
            </div>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    )
}

export default Configuraciones
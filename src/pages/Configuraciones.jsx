import { Link } from "react-router-dom"

const Configuraciones = () => {
    return (
        <section>
            <h1>Configuraciones</h1>
            <br />
            <p>Página de configuraciones</p>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    )
}

export default Configuraciones
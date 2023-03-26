import { Link } from "react-router-dom"

const Ventas = () => {
    return (
        <section>
            <h1>Ventas</h1>
            <br />
            <p>Página de gestión de Ventas</p>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    )
}

export default Ventas
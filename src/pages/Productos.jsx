import { Link } from "react-router-dom"

const Productos = () => {
    return (
        <section>
            <h1>Productos</h1>
            <br />
            <p>Página de gestión de productos</p>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    )
}

export default Productos
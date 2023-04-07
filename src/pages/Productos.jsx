import { Link } from "react-router-dom"

const Productos = () => {
    return (
        <section>
            <h1>Productos</h1>
            <br />
            <p>Página de gestión de productos</p>
            <br />
            <div>
                <Link to="lista">Lista de Productos</Link>
                <br />
                <Link to="nuevo">Nuevo Producto</Link>
                <br />
                <Link to="compra">Compras de Productos</Link>
                <br />
            </div>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    )
}

export default Productos
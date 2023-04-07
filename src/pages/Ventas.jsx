import { Link } from "react-router-dom"

const Ventas = () => {
    return (
        <section>
            <h1>Ventas</h1>
            <br />
            <p>Página de gestión de Ventas</p>
            <br />
            <div>
                <Link to="lista">Ventas</Link>
                <br />
                <Link to="nuevo">Cargar Venta</Link>
                <br />
                <Link to="cuotas">Cuotas a Cobrar</Link>
                <br />
            </div>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    )
}

export default Ventas
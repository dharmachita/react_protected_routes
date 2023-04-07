import { Link } from 'react-router-dom';

const Clientes = () => {
    return (
        <section>
            <h1>Clientes</h1>
            <br />
            <p>Página de gestión de clientes</p>
            <br />
            <div>
                <Link to="lista">Lista Clientes</Link>
                <br />
                <Link to="nuevo">Alta de Cliente</Link>
                <br />
            </div>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    )
}

export default Clientes
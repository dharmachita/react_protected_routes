import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section>
            <h1>No Autorizado</h1>
            <br />
            <p>El usuario no cuenta con acceso para ingresar a esta sección</p>
            <div className="flexGrow">
                <button onClick={goBack}>Volver</button>
            </div>
        </section>
    )
}

export default Unauthorized

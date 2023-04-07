import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link,useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";


export default function FormularioRecat() {
    const errRef = useRef();
    const [categories, setCategories] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const {state} = useLocation();
    const {editCustomer,id} = state;
    
    const initCustomer={
        prevScoreId:editCustomer.Qualification.id,
        newScoreId:editCustomer.Qualification.id,
        description:"",
        customerId:id
    }
    const [customer, setCustomer] = useState(initCustomer);
    const navigate=useNavigate();
    
    //Get Calificaciones
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCalificaciones = async () => {
            try {
                const response = await axiosPrivate.get('/qualifications', {
                    signal: controller.signal
                });
                isMounted && setCategories(response.data.data);
            } catch (err) {
                console.log(err)
                //navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getCalificaciones();
        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosPrivate.put(`/customers/score/${id}`,
            JSON.stringify(customer)
            );        
            navigate('/clientes/detalle', { state: { id:state?.editCustomer?.id }, replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('El Servidor no responde');
                //console.log(err)
            } else if (err.response?.status === 400 | err.response?.status === 401) {
                setErrMsg('Error al crear cliente');
            } else {
                setErrMsg('Error al crear cliente');
            }
            errRef.current.focus();
        }
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Recategorizar Cliente: {editCustomer.code}</h2>
            <p>Nombre y Apellido: {editCustomer.name}</p>
            <br />
            <p>Calificacion Actual: {editCustomer.Qualification.score} - {editCustomer.Qualification.description}</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="categoria">Categoría</label>
                <select
                    id='categoria'
                    value={customer.newScoreId} 
                    onChange={({target}) => setCustomer({...customer,newScoreId:target.value})}
                    defaultValue=""
                    required
                >
                    <option value=""> - - - </option>
                    {categories.map((category,i)=>
                        <option 
                            key={i}
                            value={category?.id}
                        >
                            {category?.score}-{category?.description}
                        </option>
                    )}
                </select>
                <label htmlFor="description">Justificación</label>
                <textarea
                    type="text"
                    id="description"
                    //ref={userRef}
                    //autoComplete="off"
                    onChange={({target}) => setCustomer({...customer,description:target.value})}
                    value={customer.description}
                />
                <button className='create'>Recategorizar</button>
            </form>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    );

}


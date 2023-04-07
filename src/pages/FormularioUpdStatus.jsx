import React from 'react'
import { useState,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link,useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";


export default function FormularioUpdStatus() {
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const {state} = useLocation();
    const {editCompra} = state;
    
    const initStatus={
        deliveryDate:editCompra.deliveryDate,
        isProductDelivered:editCompra.isProductDelivered
    }
    const [compra, setCompra] = useState(initStatus);
    const navigate=useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosPrivate.put(`/purchases/${editCompra.id}/status`,
            JSON.stringify(compra)
            );        
            navigate('/productos/compra', { state: { }, replace: true });
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
            <h2>Actualizar Estado de Compra: {editCompra.code}</h2>
            <br />
            <form onSubmit={handleSubmit}>
            <label htmlFor="deliveryDate">Fecha de Entrega</label>
                <input
                    type="date"
                    id="deliveryDate"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={({target}) => setCompra({...compra,deliveryDate:target.value})}
                    value={compra.deliveryDate}
                    required
                />
                <button className='create'>Actualizar</button>
            </form>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    );

}


import React from 'react'
import { useState, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from 'react-router-dom';
import { useLocation,useNavigate } from "react-router-dom";

const initAnular={
    isProductReturn:null
}

export default function AnularVenta() {
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const [anular, setAnular] = useState(initAnular);
    const {state} = useLocation();
    const { venta } = state; 
    const navigate=useNavigate();
    
    const handleAnular=async(e)=>{
        e.preventDefault();
        try {
            await axiosPrivate.put(`/orders/${venta.id}`,
            JSON.stringify(anular)
        );      
        } catch (error) {
            if (!error?.response) {
                setErrMsg('El Servidor no responde');
            } else if (error.response?.status === 400 | error.response?.status === 401) {
                setErrMsg('Error al Anular Venta');
            } else {
                setErrMsg('Error al Anular Venta');
            }
            errRef.current.focus();   
        }
        navigate('/ventas/detalle', { state: { id:venta.id }, replace: true });
    }

    const handleDate=(convertDate)=>{
        if(convertDate){
            const splittedDate=convertDate.split('-');
            return `${splittedDate[2].slice(0,2)}-${splittedDate[1]}-${splittedDate[0]}`
        }
    }
    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Anular Venta: {venta&&venta?.code}</h2>
            <br />
            {
                venta&&
                    <>
                        <p>Producto: {venta?.Product?.code} - {venta?.Product?.name}</p>
                        <p>Cliente: {venta?.Customer?.code} - {venta?.Customer?.name}</p>
                        <p>Vendedor: {venta?.Customer?.name}</p>
                        <p>Fecha de Venta: {handleDate(venta?.ventaDate)}</p>
                        <p>Estado: {venta?.status}</p>
                        <p>Cantidad: {venta?.quantity}</p>
                        <p>Entrega: {venta?.deliveryAmount}</p>
                        <p>Cuotas: {venta?.installments}</p>
                        <p>Precio Total: {venta?.price}</p>
                        <br />
                        <form onSubmit={handleAnular}>
                            <p>¿Anular con devolución?</p>
                            <select 
                                id="outType"
                                value={anular.outType} 
                                onChange={({target}) => setAnular({isProductReturn:+target.value})}
                                defaultValue=""
                                required
                            >
                                <option value="">---</option> 
                                <option value="1">SI</option> 
                                <option value="0">No</option>
                            </select>
                            
                            <button>Anular</button>
                        </form>
                    </>
            }
            <br />
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    );

}


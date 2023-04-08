import React from 'react'
import { useState, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from 'react-router-dom';
import { useLocation,useNavigate } from "react-router-dom";

const initStock={
    outType:"",
    inType:"",
    quantity:0
}

export default function AjusteStock() {
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const [stock, setStock] = useState(initStock);
    const {state} = useLocation();
    const { id,editProduct } = state; 
    const navigate=useNavigate();
    
    const handleMoveStock=async(e)=>{
        e.preventDefault();
        try {
            if(stock.inType===""){
                delete stock.inType;
            }
            if(stock.outType===""){
                delete stock.outType;
            }
            await axiosPrivate.put(`/products/${id}/stock`,
            JSON.stringify(stock)
        );      
        } catch (error) {
            if (!error?.response) {
                setErrMsg('El Servidor no responde');
                //console.log(err)
            } else if (error.response?.status === 400 | error.response?.status === 401) {
                setErrMsg('Error al actualizar stock');
            } else {
                setErrMsg('Error al actualizar stock');
            }
            errRef.current.focus();   
        }
        navigate('/productos/detalle', { state: { id }, replace: true });
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Ajustar Stock del Producto: {editProduct&&editProduct?.code} - {editProduct&&editProduct?.name}</h2>
            <br />
            {
                editProduct&&
                    <>
                        <table>
                            <caption>Stock Actual</caption>
                            <thead>
                                <tr>
                                    <th>Tipo Stock</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editProduct?.Stocks.map((stock,i)=>
                                    <tr key={i}>
                                        <th>{stock.type}</th>
                                        <th>{stock.quantity}</th>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <br />
                        <form onSubmit={handleMoveStock}>
                            <p>Stock de Salida</p>
                            <select 
                                id="outType"
                                value={stock.outType} 
                                onChange={({target}) => setStock({...stock,outType:target.value})}
                                defaultValue=""
                                required
                            >
                                <option value="">--</option> 
                                <option value="Nuevo">Nuevo</option> 
                                <option value="Devuelto">Devuelto</option>
                                <option value="Roto">Roto</option>  
                            </select>
                            <br />
                            <p>Stock de Entrada</p>
                            <select 
                                id="inType"
                                value={stock.inType} 
                                onChange={({target}) => setStock({...stock,inType:target.value})}
                                defaultValue=""
                                required
                            >
                                <option value="">--</option> 
                                <option value="Nuevo">Nuevo</option> 
                                <option value="Devuelto">Devuelto</option>
                                <option value="Roto">Roto</option>  
                            </select>
                            <label htmlFor="quantity">Cantidad</label>
                            <input
                                type="number"
                                id="quantity"
                                //ref={userRef}
                                autoComplete="off"
                                onChange={({target}) => setStock({...stock,quantity:target.value})}
                                value={stock.quantity}
                                required
                            />
                            <button onClick={handleMoveStock}>Mover/Ajustar</button>
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


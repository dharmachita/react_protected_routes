import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link,useNavigate } from 'react-router-dom';


export default function ListaVentas() {
    const errRef = useRef();
    const [ventas, setVentas] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const navigate=useNavigate();
    
    //Get Ventas
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getVentas = async () => {
            try {
                const response = await axiosPrivate.get('/orders', {
                    signal: controller.signal
                });
                isMounted && setVentas(response.data.data);
            } catch (err) {
                console.log(err)
                setErrMsg('Error buscando ventas');
            }
        }

        getVentas();

        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    const handleDetalle=(venta)=>{
        navigate('/ventas/detalle', { state: { id:venta.id }, replace: true });
    }

    return (
        <article>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Lista de Ventas</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Fecha Venta</th>
                  <th>Producto</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Precio</th>
                  <th>Vendedor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ventas?.map((venta,i)=>
                    <tr key={i}>
                      <th>{venta?.code}</th>
                      <th>{venta?.orderDate}</th>
                      <th>{venta?.Product?.name}</th>
                      <th>{venta?.Customer?.name}</th>
                      <th>{venta?.status}</th>
                      <th>{venta?.price}</th>
                      <th>{venta?.User?.name}</th>
                      <th>
                        <button className='actionbutton' onClick={()=>handleDetalle(venta)}>Ver Detalle</button>
                    </th>
                    </tr>
                  )}
              </tbody>
            </table>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </article>
    );

}


import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link,useNavigate } from 'react-router-dom';


export default function ListaCompras() {
    const errRef = useRef();
    const [compras, setCompras] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const navigate=useNavigate();
    //const [id, setId] = useState('');
    
    //Get Compras
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCompras = async () => {
            try {
                const response = await axiosPrivate.get('/purchases', {
                    signal: controller.signal
                });
                isMounted && setCompras(response.data.data);
            } catch (err) {
                console.log(err)
                setErrMsg('Error buscando compras');
                //navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getCompras();

        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    const handleDelete=async(id)=>{
        let isMounted = true;
        const controller = new AbortController();
        try {
            await axiosPrivate.delete(`/purchases/${id}`, {
                signal: controller.signal
            });
            isMounted && setCompras(compras.filter(compra => compra.id !== id));
        } catch (err) {
            console.log(err)
            setErrMsg('Error buscando clientes');
            //navigate('/login', { state: { from: location }, replace: true });
        }
    }
    const handleStatusUpdate=(compra)=>{
        navigate('/productos/compra/status', { state: { editCompra:compra }, replace: true });
    }

    const handleNuevaCompra=()=>{
        navigate('/productos/compra/form', { state: { }, replace: true });
    }

    return (
        <article>
            <div><button onClick={(handleNuevaCompra)}>+</button></div>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Lista de Compras</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Fecha Compra</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Proveedor</th>
                  <th>Fecha Entrega</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {compras?.map((compra,i)=>
                    <tr key={i}>
                      <th>{compra?.code}</th>
                      <th>{compra?.purchaseDate}</th>
                      <th>{compra?.Product?.name}</th>
                      <th>{compra?.price}</th>
                      <th>{compra?.quantity}</th>
                      <th>{compra?.price * compra?.quantity}</th>
                      <th>{compra?.supplier}</th>
                      <th>{compra?.deliveryDate}</th>
                      <th>{compra?.isProductDelivered?'Entregado':'No Entregado'}</th>
                      <th>
                        <button className='actionbutton' onClick={()=>handleDelete(compra.id)}>Eliminar</button>
                        <button className='actionbutton' disabled={compra?.isProductDelivered} onClick={()=>handleStatusUpdate(compra)}>Actualizar Estado</button>
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


import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from 'react-router-dom';
import { useLocation,useNavigate } from "react-router-dom";


export default function DetalleCliente() {
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const {state} = useLocation();
    const { id } = state; 
    const [customer,setCustomer]=useState(null);
    const navigate=useNavigate();
    
    //Get Customers
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCustomer = async () => {
            try {
                const response = await axiosPrivate.get(`/customers/${id}`, {
                    signal: controller.signal
                });
                isMounted && setCustomer(response.data.data);
            } catch (err) {
                console.log(err)
                setErrMsg('Error buscando clientes');
                //navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getCustomer();
        
        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    const handleEdit=()=>{
        navigate('/clientes/editar', { state: { id,mode:'edit',editCustomer:customer }, replace: true });
    }
    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Detalle de Cliente <b>{customer&&customer?.code}</b></h2>
            <br />
            {
                customer&&
                    <>
                    <h3>Datos de Contacto</h3>
                    <br />
                        <p>Nombre y Apellido: {customer?.name}</p>
                        <p>DNI: {customer?.dni}</p>
                        <p>Teléfono: {customer?.phone}</p>
                        <p>Dirección: {customer?.address}</p>
                        <p>Ciudad: {customer?.City.name}</p>
                        <p>Referencia: {customer?.reference}</p>
                        <br />
                    <h3>Datos de Ventas</h3>
                    <br />
                        <p>Estado: {customer?.status}</p>
                        <p>Categoría: {customer?.Qualification?.score} - {customer?.Qualification?.description}</p>
                        <p>Ventas:</p>
                            <ul>
                                {customer?.Orders.map(order=>
                                    <li>{order.id}</li>
                                )}             
                            </ul>
                    </>
            }
            <br />
            <div className="flexGrow">
                <button onClick={handleEdit}>Editar</button>
            </div>
            <br />
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    );

}


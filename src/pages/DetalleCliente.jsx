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

    const handleRecategorizar=()=>{
        navigate('/clientes/recategorizar', { state: { id,editCustomer:customer }, replace: true });
    }

    const handleHistory=()=>{
        navigate('/clientes/historial', { state: { id,editCustomer:customer }, replace: true });   
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
                    <div className="flexGrow">
                        <button onClick={handleEdit}>Editar</button>
                    </div>
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
                    <div className="flexGrow">
                        <button onClick={handleRecategorizar}>Recategorizar</button>
                    </div>
                    <div className="flexGrow">
                        <button onClick={handleHistory}>Ver Historial</button>
                    </div>
                    </>
            }
            <br />
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    );

}


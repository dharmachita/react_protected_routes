import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link,useNavigate } from 'react-router-dom';


export default function ListaClientes() {
    const errRef = useRef();
    const [customers, setCustomers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const navigate=useNavigate();
    //const [id, setId] = useState('');
    
    //Get Customers
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCustomers = async () => {
            try {
                const response = await axiosPrivate.get('/customers', {
                    signal: controller.signal
                });
                isMounted && setCustomers(response.data.data);
            } catch (err) {
                console.log(err)
                setErrMsg('Error buscando clientes');
                //navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getCustomers();

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
            await axiosPrivate.delete(`/customers/${id}`, {
                signal: controller.signal
            });
            isMounted && setCustomers(customers.filter(customer => customer.id !== id));
        } catch (err) {
            console.log(err)
            setErrMsg('Error buscando clientes');
            //navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const handleRecat=(id)=>{
        console.log(`Recategorizando cliente con ID ${id}`)
    }
    const handleDetail=(id)=>{
        navigate('/clientes/detalle', { state: { id }, replace: true });
    }

    return (
        <article>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Lista de Clientes</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre y Apellido</th>
                  <th>DNI</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Calificación</th>
                  <th>Ciudad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {customers?.map((customer,i)=>
                    <tr key={i}>
                      <th>{customer?.code}</th>
                      <th>{customer?.name}</th>
                      <th>{customer?.dni}</th>
                      <th>{customer?.phone}</th>
                      <th>{customer?.status}</th>
                      <th>{customer?.Qualification?.description}-{customer?.Qualification?.score}</th>
                      <th>{customer?.City.name}</th>
                      <th>
                        <button onClick={()=>handleDetail(customer.id)}>Ver</button>
                        <button onClick={()=>handleRecat(customer.id)}>Recategorizar</button>
                        <button onClick={()=>handleDelete(customer.id)}>Eliminar</button>
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


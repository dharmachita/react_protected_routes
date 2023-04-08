import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";


export default function HistorialCliente() {
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const {state} = useLocation();
    const { id,editCustomer } = state; 
    const [history,setHistory]=useState(null);

    
    //Get History
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getHistory = async () => {
            try {
                const response = await axiosPrivate.get(`/customers/${id}/history`, {
                    signal: controller.signal
                });
                isMounted && setHistory(response.data.data);
            } catch (err) {
                console.log(err)
                setErrMsg('Error buscando historial');
            }
        }

        getHistory();
        
        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    const handleDate=(convertDate)=>{
        const splittedDate=convertDate.split('-');
        return `${splittedDate[2].slice(0,2)}-${splittedDate[1]}-${splittedDate[0]}`
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Historial de Calificaciones del cliente: {editCustomer?.name}</h2>
            <br />
            {
                history&&
                    <>
                        <table>
                            <caption>Recategorizaciones</caption>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Motivo</th>
                                    <th>Anterior</th>
                                    <th>Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history?.map((change,i)=>
                                    <tr key={i}>
                                        <th>{handleDate(change?.createdAt)}</th>
                                        <th>{change?.description}</th>
                                        <th>{change?.prevScore?.score} - {change?.prevScore?.description}</th>
                                        <th>{change?.newScore?.score} - {change?.newScore?.description}</th>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
            }
            <br />
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    );

}


import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link,useNavigate } from 'react-router-dom';


export default function ListaCuotas() {
    const errRef = useRef();
    const [cuotas, setCuotas] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [days, setDays] = useState(10);
    const [errMsg, setErrMsg] = useState('');
    const navigate=useNavigate();
    //const [id, setId] = useState('');
    
    //Get Customers
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCuotas = async () => {
            try {
                const response = await axiosPrivate.get(`/installments/impago?limit=${days}`, {
                    signal: controller.signal
                });
                isMounted && setCuotas(response.data.data);
            } catch (err) {
                console.log(err)
                setErrMsg('Error buscando cuotas');
                //navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getCuotas();

        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [days])

    const handleDate=(convertDate)=>{
        if(convertDate){
            const splittedDate=convertDate.split('-');
            return `${splittedDate[2].slice(0,2)}-${splittedDate[1]}-${splittedDate[0]}`
        }
    }

    const handleCobrar=(ins)=>{
        navigate('/ventas/cobrar', { state: { installment:ins }, replace: true });
     }

    return (
        <section className='detalle-venta'>
        <article>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Lista de Cuotas Impagas</h2>
            <br />
            <div>
                <label htmlFor="days" className='padding'>Cantidad de Días</label>
                <input
                    type="number"
                    id="days"
                    autoComplete="off"
                    onChange={({target}) => setDays(target.value)}
                    value={days}
                    required
                />
            </div> 
            <br />
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Monto</th>
                        <th>Status</th>
                        <th>Cobrador</th>
                        <th>Vendedor</th>
                        <th>Producto</th>
                        <th>Cliente</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cuotas.map((ins,i)=>
                        <tr key={i}>
                            <th>{handleDate(ins?.dueDate)}</th>
                            <th>{ins?.amount}</th>
                            <th>{ins?.status}</th>
                            <th>{ins?.User?.name}</th>
                            <th>{ins?.Order?.User?.name}</th>
                            <th>{ins?.Order?.Product?.name}</th>
                            <th>{ins?.Order?.Customer?.name}</th>
                            <th><button onClick={()=>handleCobrar(ins)} className='actionbutton'>Cobrar</button></th>
                        </tr>
                    )}
                </tbody>
            </table>
            <br />
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </article>
        </section>
    );

}


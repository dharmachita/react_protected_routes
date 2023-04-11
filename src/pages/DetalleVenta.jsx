import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from 'react-router-dom';
import { useLocation,useNavigate } from "react-router-dom";


export default function DetalleVenta() {
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const {state} = useLocation();
    const { id } = state; 
    const [order,setOrder]=useState(null);
    const navigate=useNavigate();
    
    //Get Products
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getOrder = async () => {
            try {  
                const response = await axiosPrivate.get(`/orders/${id}`, {
                    signal: controller.signal
                });
                isMounted && setOrder(response.data.data);
            } catch (err) {
                console.log(err)
                setErrMsg('Error buscando detalles de ventas');
            }
        }

        getOrder();
        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    const handleDate=(convertDate)=>{
        if(convertDate){
            const splittedDate=convertDate.split('-');
            return `${splittedDate[2].slice(0,2)}-${splittedDate[1]}-${splittedDate[0]}`
        }
    }
    const handleAnular=()=>{
       navigate('/ventas/anular', { state: { venta:order }, replace: true });
    }

    const handleCobrar=(ins)=>{
        navigate('/ventas/cobrar', { state: { id:order.id,installment:ins }, replace: true });
     }

    return (
        <section className="detalle-venta">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Detalle de Orden de Venta <b>{order&&order?.code}</b></h2>
            <br />
            {
                order&&
                    <>
                        <p>Producto: {order?.Product?.code} - {order?.Product?.name}</p>
                        <p>Cliente: {order?.Customer?.code} - {order?.Customer?.name}</p>
                        <p>Vendedor: {order?.Customer?.name}</p>
                        <p>Fecha de Venta: {handleDate(order?.orderDate)}</p>
                        <p>Estado: {order?.status}</p>
                        <p>Cantidad: {order?.quantity}</p>
                        <p>Entrega: {order?.deliveryAmount}</p>
                        <p>Cuotas: {order?.installments}</p>
                        <p>Precio Total: {order?.price}</p>
                        <div><button onClick={handleAnular} disabled={order?.status==="Anulado"}>Anular</button></div>
                        
                        <br />
                        <table>
                            <caption>Plan de Cuotas</caption>
                            <thead>
                                <tr>
                                    <th>N° cuota</th>
                                    <th>Fecha</th>
                                    <th>Valor</th>
                                    <th>Fecha Pagada</th>
                                    <th>Valor Pagado</th>
                                    <th>Status</th>
                                    <th>Cobrador</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.Installments.map((ins,i)=>
                                    <tr key={i}>
                                        <th>{ins?.number}</th>
                                        <th>{handleDate(ins?.dueDate)}</th>
                                        <th>{ins?.amount}</th>
                                        <th>{handleDate(ins?.paidDate)}</th>
                                        <th>{ins?.amountPaid}</th>
                                        <th>{ins?.status}</th>
                                        <th>{ins?.User?.name}</th>
                                        <th><button onClick={()=>handleCobrar(ins)} className='actionbutton'>Cobrar</button></th>
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


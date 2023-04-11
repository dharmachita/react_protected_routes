import React from 'react'
import { useState, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from 'react-router-dom';
import { useLocation,useNavigate } from "react-router-dom";

const initPay={
    amountPaid:"",
    paidDate:""
}

export default function CobrarCuota() {
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const [message, setMessage] = useState();
    const {state} = useLocation();
    const { id,installment } = state; 
    const [pay, setPay] = useState({...initPay,amountPaid:installment.amount});
    const navigate=useNavigate();
    
    const handlePay=async(e)=>{
        e.preventDefault();
        try {
            await axiosPrivate.put(`/installments/${installment.id}`,
            JSON.stringify(pay)
        );      
        } catch (error) {
            if (!error?.response) {
                setErrMsg('El Servidor no responde');
            } else if (error.response?.status === 400 | error.response?.status === 401) {
                setErrMsg('Error al cobrar cuota');
            } else {
                setErrMsg('Error al cobrar cuota');
            }
            errRef.current.focus();   
        }
        setMessage("Cuota cobrada");   
        setTimeout(() => {
            id?navigate('/ventas/detalle', { state: { id }, replace: true }):navigate('/ventas/cuotas', { state: { }, replace: true }); 
        }, 2000);
        
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
            <p ref={errRef} className={message ? "code" : "offscreen"} aria-live="assertive">{message}</p>
            <h2>Cobrar Cuota</h2>
            <br />
            {
                installment&&
                    <>
                    <div>
                        <p>N° cuota: {installment?.number}</p>
                        <p>Fecha: {handleDate(installment?.dueDate)}</p>
                        <p>Valor: {installment?.amount}</p>
                        <p>Fecha Pagada: {handleDate(installment?.paidDate)}</p>
                        <p>Valor Pagado: {installment?.amountPaid}</p>
                        <p>Status: {installment?.status}</p>
                        <p>Cobrador: {installment?.User?.name}</p>
                    </div>
                        <br />
                        <form onSubmit={handlePay}>
                            <label htmlFor="amountPaid">Monto Cobrado</label>
                            <input
                                type="number"
                                id="amountPaid"
                                autoComplete="off"
                                onChange={({target}) => setPay({...pay,amountPaid:target.value})}
                                value={pay.amountPaid}
                                required
                            />
                            <label htmlFor="paidDate">Fecha de Cobro</label>
                            <input
                                type="date"
                                id="paidDate"
                                autoComplete="off"
                                onChange={({target}) => setPay({...pay,paidDate:target.value})}
                                value={pay.paidDate}
                                required
                            />
                            <button>Cobrar</button>
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


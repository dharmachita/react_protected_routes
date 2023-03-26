import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link,useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";


export default function FormularioCliente() {
    const errRef = useRef();
    const [cities, setCities] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const [code, setCode] = useState(null);
    const {state} = useLocation();
    const initCustomer={
        name:"",
        dni:"",
        phone:"",
        address:"",
        reference:"",
        lon:-55.022565,
        lat:-26.818653,
        cityId:""
    }
    const [customer, setCustomer] = useState(initCustomer);
    const navigate=useNavigate();
    
    //Get Cities
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCities = async () => {
            try {
                const response = await axiosPrivate.get('/cities', {
                    signal: controller.signal
                });
                isMounted && setCities(response.data.data);
            } catch (err) {
                console.log(err)
                //navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getCities();

        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    //Set customer
    useEffect(() => {
        state?.mode==='edit'&&setCustomer(state?.editCustomer);
    // eslint-disable-next-line
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(state?.mode==='edit'){
                await axiosPrivate.put(`/customers/${state?.id}`,
                    JSON.stringify(customer)
                );        
                setCustomer(initCustomer)
                navigate('/clientes/detalle', { state: { id:state?.editCustomer?.id }, replace: true });
            }else{
                const response = await axiosPrivate.post('/customers',
                JSON.stringify(customer)
            );        
                setCustomer(initCustomer)
                setCode(response?.data?.data?.code);
            }
            
            //redirect to customer data
        } catch (err) {
            if (!err?.response) {
                setErrMsg('El Servidor no responde');
                //console.log(err)
            } else if (err.response?.status === 400 | err.response?.status === 401) {
                setErrMsg('Error al crear cliente');
            } else {
                setErrMsg('Error al crear cliente');
            }
            errRef.current.focus();
        }
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <p ref={errRef} className={code ? "code" : "offscreen"} aria-live="assertive">Cliente creado con código: <b>{code}</b></p>
            <h2>{state?.mode==='edit'?`Editar Cliente ${state?.editCustomer?.code}`:'Alta de Cliente'}</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nombre y Apellido</label>
                <input
                    type="text"
                    id="name"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={({target}) => setCustomer({...customer,name:target.value})}
                    value={customer.name}
                    required
                />
                <label htmlFor="dni">DNI</label>
                <input
                    type="text"
                    id="dni"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={({target}) => setCustomer({...customer,dni:target.value})}
                    value={customer.dni}
                    required
                />
                <label htmlFor="phone">Teléfono</label>
                <input
                    type="phone"
                    id="phone"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={({target}) => setCustomer({...customer,phone:target.value})}
                    value={customer.phone}
                    required
                />
                <label htmlFor="address">Dirección</label>
                <input
                    type="text"
                    id="address"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={({target}) => setCustomer({...customer,address:target.value})}
                    value={customer.address}
                    required
                />
                <label htmlFor="city">Ciudad</label>
                <select
                    id='city'
                    value={customer.cityId} 
                    onChange={({target}) => setCustomer({...customer,cityId:target.value})}
                    defaultValue=""
                    required
                >
                    <option value=""> - - - </option>
                    {cities.map((city,i)=>
                        <option 
                            key={i}
                            value={city?.id}
                        >
                            {city?.name}
                        </option>
                    )}
                </select>
                <label htmlFor="reference">Referencia</label>
                <textarea
                    type="text"
                    id="reference"
                    //ref={userRef}
                    //autoComplete="off"
                    onChange={({target}) => setCustomer({...customer,reference:target.value})}
                    value={customer.reference}
                />
                <button className='create'>{state?.mode==='edit'?`Guardar`:'Crear'}</button>
            </form>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    );

}


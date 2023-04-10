import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link, useNavigate } from 'react-router-dom';

const initVenta={
    installmentQty:null,   
    initDueDate:null,     
    orderDate:null,        
    amount:null,           
    price:null,            
    collectorId:"",     
    sellerId:"",         
    productId:"",        
    customerId:"",
    deliveryAmount:null
}

export default function FormularioVenta() {
    const errRef = useRef();
    const [producto, setProducto] = useState([]);
    const [cliente, setCliente] = useState([]);
    const [user, setUser] = useState([]);
    const [code, setCode] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const [venta, setVenta] = useState(initVenta);
    const navigate = useNavigate();
    
    //Get productos
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getProductos = async () => {
            try {
                const response = await axiosPrivate.get('/products', {
                    signal: controller.signal
                });
                isMounted && setProducto(response.data.data);
            } catch (err) {
                console.log(err)
            }
        }
        const getClientes = async () => {
            try {
                const response = await axiosPrivate.get('/customers', {
                    signal: controller.signal
                });
                isMounted && setCliente(response.data.data);
            } catch (err) {
                console.log(err)
            }
        }
        const getUser = async () => {
            try {
                const response = await axiosPrivate.get('/users?isActive=1', {
                    signal: controller.signal
                });
                isMounted && setUser(response.data.data);
            } catch (err) {
                console.log(err)
            }
        }

        getProductos();
        getClientes();
        getUser();

        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosPrivate.post('/orders',
                JSON.stringify(venta)
                );      
            setCode(response?.data?.data.code);
            setTimeout(() => {
                navigate(`/ventas/detalle`, { state: { id:response?.data?.data.id }, replace: true });   
            }, 5000);

        } catch (err) {
            if (!err?.response) {
                setErrMsg('El Servidor no responde');
            } else if (err.response?.status === 400 | err.response?.status === 401) {
                setErrMsg('Error al cargar la venta');
            } else {
                setErrMsg('Error al cargar la venta');
            }
            errRef.current.focus();
        }
    }

    const handleTotalPrice=(target)=>{
        let installment=+venta.installmentQty;
        let amount=+venta.amount;
        let deliveryAmount=+venta.deliveryAmount;
        let price=0;
        switch (target.id) {
            case 'installment':
                installment = +target.value;
                price=installment*amount+deliveryAmount;
                setVenta({...venta,installmentQty:installment,price});                
                break;
            case "amount":
                amount = +target.value;
                price=installment*amount+deliveryAmount;
                setVenta({...venta,amount,price}); 
                break;
            case "deliveryAmount":
                deliveryAmount = +target.value;
                price=installment*amount+deliveryAmount;
                setVenta({...venta,deliveryAmount,price}); 
                break;
            default:
                break;
        }

    };

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <p ref={errRef} className={code ? "code" : "offscreen"} aria-live="assertive">Compra cargada con código: <b>{code}</b></p>
            <h2>Venta</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="product">Producto</label>
                <select
                    id='product'
                    value={venta.productId} 
                    onChange={({target}) => setVenta({...venta,productId:target.value})}
                    required
                >
                    <option value=""> - - - </option>
                    {producto.map((item,i)=>
                        <option 
                            key={i}
                            value={item?.id}
                        >
                            {item?.name}
                        </option>
                    )}
                </select>
                <label htmlFor="customer">Cliente</label>
                <select
                    id='customer'
                    value={venta.customerId} 
                    onChange={({target}) => setVenta({...venta,customerId:target.value})}
                    required
                >
                    <option value=""> - - - </option>
                    {cliente.map((item,i)=>
                        <option 
                            key={i}
                            value={item?.id}
                        >
                            {item?.name}
                        </option>
                    )}
                </select>
                <label htmlFor="seller">Vendedor</label>
                <select
                    id='seller'
                    value={venta.sellerId} 
                    onChange={({target}) => setVenta({...venta,sellerId:target.value})}
                    required
                >
                    <option value=""> - - - </option>
                    {user.filter(item=>item.Roles.some(rol=>rol.name.includes("Vendedor"))).map((item,i)=>
                        <option 
                            key={i}
                            value={item?.id}
                        >
                            {item?.name}
                        </option>
                    )}
                </select>
                <label htmlFor="collector">Cobrador</label>
                <select
                    id='collector'
                    value={venta.collectorId} 
                    onChange={({target}) => setVenta({...venta,collectorId:target.value})}
                    required
                >
                    <option value=""> - - - </option>
                    {user.filter(item=>item.Roles.some(rol=>rol.name.includes("Cobrador"))).map((item,i)=>
                        <option 
                            key={i}
                            value={item?.id}
                        >
                            {item?.name}
                        </option>
                    )}
                </select>
                <label htmlFor="installment">Cuotas</label>
                <select
                    id='installment'
                    value={venta.installmentQty} 
                    onChange={({target}) => handleTotalPrice(target)}
                    required
                >
                    <option value="0"> - - - </option>
                    <option value="6"> 6 </option>
                    <option value="12"> 12 </option>
                    <option value="18"> 18 </option>
                    <option value="24"> 24 </option>
                </select>
                <label htmlFor="deliveryAmount">Entrega</label>
                <input
                    type="number"
                    id="deliveryAmount"
                    autoComplete="off"
                    onChange={({target}) => handleTotalPrice(target)}
                    value={venta.deliveryAmount}
                    required
                />
                <label htmlFor="amount">Valor Cuota</label>
                <input
                    type="number"
                    id="amount"
                    autoComplete="off"
                    onChange={({target}) => handleTotalPrice(target)}
                    value={venta.amount}
                    required
                />
                <label htmlFor="price">Precio Total</label>
                <input
                    type="number"
                    id="price"
                    autoComplete="off"
                    onChange={({target}) => setVenta({...venta,price:target.value})}
                    value={venta.price}
                    required
                    disabled
                />
                <label htmlFor="orderDate">Fecha de Venta</label>
                <input
                    type="date"
                    id="orderDate"
                    autoComplete="off"
                    onChange={({target}) => setVenta({...venta,orderDate:target.value})}
                    value={venta.orderDate}
                    required
                />
                <label htmlFor="initDueDate">Vencimiento Primera Cuota</label>
                <input
                    type="date"
                    id="initDueDate"
                    autoComplete="off"
                    onChange={({target}) => setVenta({...venta,initDueDate:target.value})}
                    value={venta.initDueDate}
                    required
                />
                <button className='create'>Crear Venta</button>
            </form>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    );

}


import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link,useLocation} from 'react-router-dom';


export default function FormularioVenta() {
    const errRef = useRef();
    const [producto, setProducto] = useState([]);
    const [code, setCode] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const {state} = useLocation();
    const initCompra={
        "purchaseDate":"",
        "price":"",
        "quantity":"",
        "supplier":"",
        "productId":"",
        "total":""
    }
    const [compra, setCompra] = useState(initCompra);
    
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
                //navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getProductos();

        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    //Set Compra
    useEffect(() => {
        state?.mode==='edit'&&setCompra(state?.editCompra);
    // eslint-disable-next-line
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(state?.mode==='edit'){
                await axiosPrivate.put(`/purchases/${state?.id}`,
                    JSON.stringify(compra)
                );        
                
                //navigate('/productos/detalle', { state: { id:state?.editProduct?.id }, replace: true });
            }else{
                const response = await axiosPrivate.post('/purchases',
                JSON.stringify(compra)
            );        
                setCode(response?.data?.data.code);
            }
            setCompra(initCompra)
            //redirect to customer data
        } catch (err) {
            if (!err?.response) {
                setErrMsg('El Servidor no responde');
                //console.log(err)
            } else if (err.response?.status === 400 | err.response?.status === 401) {
                setErrMsg('Error al cargar la compra');
            } else {
                setErrMsg('Error al cargar la compra');
            }
            errRef.current.focus();
        }
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <p ref={errRef} className={code ? "code" : "offscreen"} aria-live="assertive">Compra cargada con código: <b>{code}</b></p>
            <h2>{state?.mode==='edit'?`Editar Compra ${state?.editProduct?.code}`:'Nueva Compra'}</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="purchaseDate">Fecha de Compra</label>
                <input
                    type="date"
                    id="purchaseDate"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={({target}) => setCompra({...compra,purchaseDate:target.value})}
                    value={compra.purchaseDate}
                    required
                />
                <label htmlFor="product">Producto</label>
                <select
                    id='product'
                    value={compra.productId} 
                    onChange={({target}) => setCompra({...compra,productId:target.value})}
                    required
                >
                    <option value=""> - - - </option>
                    {producto.map((product,i)=>
                        <option 
                            key={i}
                            value={product?.id}
                        >
                            {product?.name}
                        </option>
                    )}
                </select>
                <label htmlFor="supplier">Proveedor</label>
                <input
                    type="text"
                    id="supplier"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={({target}) => setCompra({...compra,supplier:target.value})}
                    value={compra.supplier}
                    required
                />
                <label htmlFor="quantity">Cantidad</label>
                <input
                    type="number"
                    id="quantity"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={({target}) => setCompra({...compra,quantity:target.value,total:target.value*compra.price})}
                    value={compra.quantity}
                    required
                />
                <label htmlFor="price">Precio Unidad</label>
                <input
                    type="number"
                    id="price"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={({target}) => setCompra({...compra,price:target.value,total:compra.quantity*target.value})}
                    value={compra.price}
                    required
                />
                <label htmlFor="name">Total</label>
                <input
                    type="text"
                    id="name"
                    //ref={userRef}
                    autoComplete="off"
                    disabled
                    value={compra.total}
                    required
                />
                <button className='create'>{state?.mode==='edit'?`Guardar`:'Crear'}</button>
            </form>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    );

}


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
    const [product,setProduct]=useState(null);
    const navigate=useNavigate();
    
    //Get Products
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCustomer = async () => {
            try {
                const response = await axiosPrivate.get(`/products/${id}`, {
                    signal: controller.signal
                });
                isMounted && setProduct(response.data.data);
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
        navigate('/productos/editar', { state: { id,mode:'edit',editProduct:{...product,categoryId:product.Category.id} }, replace: true });
    }
    const handleAjustarStock=()=>{
        navigate('/productos/stock', { state: { id,editProduct:product }, replace: true });
    }
    const handleHistorialStock=()=>{
        navigate('/productos/stock/historial', { state: { id,editProduct:product }, replace: true });
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Detalle de Producto <b>{product&&product?.code}</b></h2>
            <br />
            {
                product&&
                    <>
                        <p>Producto: {product?.name}</p>
                        <p>Categoría: {product?.Category?.name}</p>
                        <p>Descripción: {product?.description}</p>
                        <div className="flexGrow">
                            <button onClick={handleEdit}>Editar</button>
                        </div>
                        <br />
                        <table>
                            <caption>Stock</caption>
                            <thead>
                                <tr>
                                    <th>Tipo Stock</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product?.Stocks.map((stock,i)=>
                                    <tr key={i}>
                                        <th>{stock.type}</th>
                                        <th>{stock.quantity}</th>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="flexGrow">
                            <button onClick={handleAjustarStock}>Ajustar Stock</button>
                        </div>
                        <div className="flexGrow">
                            <button onClick={handleHistorialStock}>Historial de Stock</button>
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


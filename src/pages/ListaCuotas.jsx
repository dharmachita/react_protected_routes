import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link,useNavigate } from 'react-router-dom';


export default function ListaCuotas() {
    const errRef = useRef();
    const [products, setProducts] = useState([]);
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
                const response = await axiosPrivate.get('/products', {
                    signal: controller.signal
                });
                isMounted && setProducts(response.data.data);
            } catch (err) {
                console.log(err)
                setErrMsg('Error buscando productos');
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
            await axiosPrivate.delete(`/products/${id}`, {
                signal: controller.signal
            });
            isMounted && setProducts(products.filter(product => product.id !== id));
        } catch (err) {
            console.log(err)
            setErrMsg('Error buscando clientes');
            //navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const handleDetail=(id)=>{
        navigate('/productos/detalle', { state: { id }, replace: true });
    }

    return (
        <article>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>Lista de Productos</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product,i)=>
                    <tr key={i}>
                      <th>{product?.code}</th>
                      <th>{product?.name}</th>
                      <th>{product?.description}</th>
                      <th>{product?.Category.name}</th>
                      <th>
                        <button className='actionbutton' onClick={()=>handleDetail(product.id)}>Ver</button>
                        <button className='actionbutton' onClick={()=>handleDelete(product.id)}>Eliminar</button>
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


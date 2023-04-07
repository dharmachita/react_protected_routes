import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link,useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";


export default function FormularioProducto() {
    const errRef = useRef();
    const [categories, setCategories] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const [code, setCode] = useState(null);
    const {state} = useLocation();
    const initProducts={
        name: "",
        description: "",
        categoryId:""
    }
    const [product, setProduct] = useState(initProducts);
    const navigate=useNavigate();
    
    //Get categories
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCategories = async () => {
            try {
                const response = await axiosPrivate.get('/categories', {
                    signal: controller.signal
                });
                isMounted && setCategories(response.data.data);
            } catch (err) {
                console.log(err)
                //navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getCategories();

        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    //Set Product
    useEffect(() => {
        state?.mode==='edit'&&setProduct(state?.editProduct);
    // eslint-disable-next-line
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(state?.mode==='edit'){
                await axiosPrivate.put(`/products/${state?.id}`,
                    JSON.stringify(product)
                );        
                setProduct(initProducts)
                navigate('/productos/detalle', { state: { id:state?.editProduct?.id }, replace: true });
            }else{
                const response = await axiosPrivate.post('/products',
                JSON.stringify(product)
            );        
                setProduct(initProducts)
                setCode(response?.data?.code);
            }
            
            //redirect to customer data
        } catch (err) {
            if (!err?.response) {
                setErrMsg('El Servidor no responde');
                //console.log(err)
            } else if (err.response?.status === 400 | err.response?.status === 401) {
                setErrMsg('Error al crear producto');
            } else {
                setErrMsg('Error al crear producto');
            }
            errRef.current.focus();
        }
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <p ref={errRef} className={code ? "code" : "offscreen"} aria-live="assertive">Producto creado con código: <b>{code}</b></p>
            <h2>{state?.mode==='edit'?`Editar Producto ${state?.editProduct?.code}`:'Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nombre</label>
                <input
                    type="text"
                    id="name"
                    //ref={userRef}
                    autoComplete="off"
                    onChange={({target}) => setProduct({...product,name:target.value})}
                    value={product.name}
                    required
                />
                <label htmlFor="description">Descripción</label>
                <textarea
                    type="text"
                    id="description"
                    //ref={userRef}
                    //autoComplete="off"
                    onChange={({target}) => setProduct({...product,description:target.value})}
                    value={product.description}
                />
                <label htmlFor="category">Categoría</label>
                <select
                    id='category'
                    value={product.categoryId} 
                    onChange={({target}) => setProduct({...product,categoryId:target.value})}
                    required
                >
                    <option value=""> - - - </option>
                    {categories.map((category,i)=>
                        <option 
                            key={i}
                            value={category?.id}
                        >
                            {category?.name}
                        </option>
                    )}
                </select>
                <button className='create'>{state?.mode==='edit'?`Guardar`:'Crear'}</button>
            </form>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    );

}


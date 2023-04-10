import React from 'react'
import { useState, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from 'react-router-dom';
 
const initCategory={
    name:""
}

export default function FormularioCatProd() {
    const errRef = useRef();
    const [categories, setCategories] = useState(initCategory);
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosPrivate.post(`/categories`,
                JSON.stringify(categories)
            ); 
            setSuccess(true); 
            setCategories(initCategory);
            setTimeout(() => {
                setSuccess(false);          
            }, 7000);   
              
        } catch (err) {
            if (!err?.response) {
                setErrMsg('El Servidor no responde');
                //console.log(err)
            } else if (err.response?.status === 400 | err.response?.status === 401) {
                setErrMsg('Error al crear la categoría');
            } else {
                setErrMsg('Error al crear la categoría');
            }
            errRef.current.focus();
        }
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <p ref={errRef} className={success ? "code" : "offscreen"} aria-live="assertive">Categoría creada</p>
            <h2>Crear Categoría de Producto:</h2>
            <br />
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nombre de la Categoría</label>
                <input
                    type="text"
                    id="name"
                    autoComplete="off"
                    onChange={({target}) => setCategories({...categories,name:target.value})}
                    value={categories.name}
                    required
                />
                <button className='create'>Crear</button>
            </form>
            <div className="flexGrow">
                <Link to="/">Volver al Menú</Link>
            </div>
        </section>
    );

}


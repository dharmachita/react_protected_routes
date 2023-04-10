import React from 'react'
import { useState, useEffect,useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link,useLocation,useNavigate} from 'react-router-dom';

const initUser={
    username:"",
    password:"",
    name:"",
    roleId:[]
}

export default function FormularioUsuario() {
    const errRef = useRef();
    const [roles, setRoles] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const {state} = useLocation();
    const [user, setUser] = useState(initUser);
    const navigate=useNavigate();
    
    //Get Cities
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getRoles = async () => {
            try {
                const response = await axiosPrivate.get('/roles', {
                    signal: controller.signal
                });
                isMounted && setRoles(response.data.data);
            } catch (err) {
                setErrMsg(err?.message);
            }
        }

        getRoles();

        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(state?.mode==='edit'){
                await axiosPrivate.put(`/users/${state?.id}`,
                    JSON.stringify(user)
                );        
            }else{
                await axiosPrivate.post('/users',
                    JSON.stringify(user)
                );        
            }
            setUser(initUser)
            navigate('/configuraciones/usuarios', { state: { }, replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('El Servidor no responde');
            } else if (err.response?.status === 400 | err.response?.status === 401) {
                setErrMsg('Error al crear cliente');
            } else {
                setErrMsg('Error al crear cliente');
            }
            errRef.current.focus();
        }
    }

    const handleChange = (e) => {
        let roleId = [...recipeRef.current.options]
                    .filter(option => option.selected)
                    .map(option => option.value)
        user.roleId=roleId;
    }
    const recipeRef = useRef()

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h2>{state?.mode==='edit'?`Editar Usuario ${state?.editUser?.username}`:'Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit}>
            <label htmlFor="username2">Usuario</label>
                <input
                    type="text"
                    id="username2"
                    autocomplete="off"
                    onChange={({target}) => setUser({...user,username:target.value})}
                    value={user.username}
                    required
                    disabled={state?.mode==='edit'}
                />
                <label htmlFor="name2">Nombre y Apellido</label>
                <input
                    type="text"
                    id="name2"
                    autocomplete="off"
                    onChange={({target}) => setUser({...user,name:target.value})}
                    value={user.name}
                    required
                />
                <label htmlFor="password2">Password</label>
                <input
                    type="password"
                    id="password2"
                    autocomplete="off"
                    onChange={({target}) => setUser({...user,password:target.value})}
                    value={user.password}
                    required
                />
                <label htmlFor="roleId">Roles</label>
                <select 
                    name="roleId" 
                    id="roleId" 
                    ref={recipeRef} 
                    multiple={true} 
                    onChange={(e)=>handleChange()}
                    required
                >
                    <option value=""> - - - </option>
                    {roles.map((role,i)=>
                        <option 
                            key={i}
                            value={role?.id}
                        >
                            {role?.name}
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


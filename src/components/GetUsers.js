import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const GetUsers = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                isMounted && setUsers(response.data.data);
            } catch (err) {
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [users])

    const handleActivar=async({id,isActive})=>{
        const data={status:!isActive};
        try {
            await axiosPrivate.put(`/users/${id}`,
                JSON.stringify(data)
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditar=async({id})=>{
        try {
            alert("Editar");
            /*
            await axiosPrivate.put(`/users/${id}`,
                JSON.stringify(data)
            )*/

        } catch (error) {
        }
    }
    return (
        <article>
            {users?.length
                ? (
                <table>
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Roles</th>
                        <th>Estado</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((user,i)=>
                          <tr key={i}>
                            <th>{user?.username}</th>
                            <th>{user?.name}</th>
                            <th>{user?.Roles.map((role,j)=><p key={j}>{role.name}</p>)}</th>
                            <th>{user?.isActive?'Activo':'Inactivo'}</th>
                            <th>
                                <button className='actionbutton' onClick={()=>handleEditar(user)}>Editar</button>
                                <button className='actionbutton' onClick={()=>handleActivar(user)}>{user?.isActive?'Desactivar':'Activar'}</button>
                          </th>
                          </tr>
                        )}
                    </tbody>
                  </table>
                ) : <p>No hay usuarios para mostrar</p>
            }
        </article>
    );
};

export default GetUsers;

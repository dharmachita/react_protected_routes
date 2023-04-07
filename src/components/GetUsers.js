import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const GetUsers = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setUsers(response.data.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    // eslint-disable-next-line
    }, [])

    return (
        <article>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => 
                            {return(
                                <>
                                    <li key={i}><b>{user?.username}</b>{user?.name}</li>
                                    <ul>
                                        {user?.Roles?.map((rol,j)=><li key={j}>{rol?.name}</li>)}
                                    </ul>                                  
                                </>                              
                            )}
                        )}
                    </ul>
                ) : <p>No users to display</p>
            }
        </article>
    );
};

export default GetUsers;
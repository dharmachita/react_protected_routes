import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';

//pages
import Login from './pages/Login';
import Home from './pages/Home';
import Missing from './pages/Missing';
import Unauthorized from './pages/Unauthorized';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';
import Configuraciones from './pages/Configuraciones';
import Productos from './pages/Productos';
import Users from './pages/Users';
import FormularioCliente from './pages/FormularioCliente';
import ListaClientes from './pages/ListaClientes';
import DetalleCliente from './pages/DetalleCliente';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<RequireAuth allowedRoles={["User","Admin"]} />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="clientes" element={<Clientes />} />
          <Route path="clientes/nuevo" element={<FormularioCliente />} />
          <Route path="clientes/lista" element={<ListaClientes />} />
          <Route path="clientes/detalle" element={<DetalleCliente />} />
          <Route path="clientes/editar" element={<FormularioCliente />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="productos" element={<Productos />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="ventas" element={<Ventas />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="configuraciones" element={<Configuraciones />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="users" element={<Users />} />
        </Route>
        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
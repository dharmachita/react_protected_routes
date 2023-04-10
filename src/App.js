import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';

//pages
import Login from './pages/Login';
import Home from './pages/Home';
import Missing from './pages/Missing';
import Unauthorized from './pages/Unauthorized';

import Ventas from './pages/Ventas';
import FormularioVenta from './pages/FormularioVenta';
import DetalleVenta from './pages/DetalleVenta';
import ListaVentas from './pages/ListaVentas';
import AnularVenta from './pages/AnularVenta';
import CobrarCuota from './pages/CobrarCuota';

import Clientes from './pages/Clientes';
import FormularioCliente from './pages/FormularioCliente';
import ListaClientes from './pages/ListaClientes';
import DetalleCliente from './pages/DetalleCliente';
import FormularioRecat from './pages/FormularioRecat';
import HistorialCliente from './pages/HistorialCliente';

import Productos from './pages/Productos';
import FormularioProducto from './pages/FormularioProducto';
import ListaProductos from './pages/ListaProductos';
import DetalleProducto from './pages/DetalleProducto';
import FormularioCompra from './pages/FormularioCompra';
import FormularioUpdStatus from './pages/FormularioUpdStatus';
import ListaCompras from './pages/ListaCompras';
import AjusteStock from './pages/AjusteStock';
import HistorialStock from './pages/HistorialStock';

import Configuraciones from './pages/Configuraciones';
import FormularioCatProd from './pages/FormularioCatProd';
import Users from './pages/Users';
import FormularioUsuario from './pages/FormularioUsuario';

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
          <Route path="clientes/recategorizar" element={<FormularioRecat />} />
          <Route path="clientes/historial" element={<HistorialCliente />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="productos" element={<Productos />} />
          <Route path="productos/nuevo" element={<FormularioProducto />} />
          <Route path="productos/lista" element={<ListaProductos />} />
          <Route path="productos/detalle" element={<DetalleProducto />} />
          <Route path="productos/editar" element={<FormularioProducto />} />
          <Route path="productos/compra" element={<ListaCompras />} />
          <Route path="productos/compra/form" element={<FormularioCompra />} />
          <Route path="productos/compra/status" element={<FormularioUpdStatus />} />
          <Route path="productos/stock" element={<AjusteStock />} />
          <Route path="productos/stock/historial" element={<HistorialStock />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="ventas" element={<Ventas />} />
          <Route path="ventas/lista" element={<ListaVentas />} />
          <Route path="ventas/nuevo" element={<FormularioVenta />} />
          <Route path="ventas/detalle" element={<DetalleVenta />} />
          <Route path="ventas/anular" element={<AnularVenta />} />
          <Route path="ventas/cobrar" element={<CobrarCuota />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="configuraciones" element={<Configuraciones />} />
          <Route path="configuraciones/categorias" element={<FormularioCatProd />} />
          <Route path="configuraciones/usuarios" element={<Users />} />
          <Route path="configuraciones/usuarios/formulario" element={<FormularioUsuario />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
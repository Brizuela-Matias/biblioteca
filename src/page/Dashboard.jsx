import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    BarChart3,
    CircleDollarSign,
    UserRoundPen,
    UserStar,
    UserRoundGroup,
    HandCoins,
    SquareArrowDownLeftEnter,
    LogOut,
} from 'lucide-react';
import Socios from '../components/Socios.jsx';
import Libro from '../components/Libros.jsx';
import Pagos from '../components/Pagos.jsx';
import { Usuario } from '../components/Usuario.jsx';
import Devoluciones from '../components/Devoluciones.jsx';
import Prestamos from '../components/Prestamos.jsx';
import Autores from '../components/Autores.jsx';
import Reportes from '../components/Reportes.jsx';
import CitaDelDia from '../components/common/CitaDelDia.jsx';
import { apiRequest } from '../api.js';

function Dashboard({ usuarioActual, onCerrarSesion }) {

    const [mostrarSocios, setMostrarSocios] = useState(false);
    const [mostrarLibros, setMostrarLibros] = useState(false);
    const [mostrarAutores, setMostrarAutores] = useState(false);
    const [mostrarPagos, setMostrarPagos] = useState(false);
    const [mostrarUsuario, setMostrarUsuario] = useState(false);
    const [mostrarDevoluciones, setMostrarDevoluciones] = useState(false);
    const [mostrarPrestamos, setMostrarPrestamos] = useState(false);
    const [mostrarReportes, setMostrarReportes] = useState(false);

    const [resumen, setResumen] = useState(null);

    const esAdmin = usuarioActual?.rol === "ADMIN";

    const cargarResumen = async () => {
        try {
            const data = await apiRequest('/reportes/resumen');
            setResumen(data);
        } catch (error) {
            console.error("Error al cargar resumen en inicio:", error);
        }
    };

    useEffect(() => {
        cargarResumen();
    }, []);

    const cerrarModalYRefrescar = (setter) => {
        setter(false);
        cargarResumen();
    };

    return (
        <div className="container-biblioteca">
            <div className="seccion-titulo">
                <div className="titulo-info">
                    <h1 className="nombre-biblioteca">
                        Hola {usuarioActual?.nombre_completo || usuarioActual?.nombre_usuario}, bienvenido a la Biblioteca
                    </h1>

                    <p className="subtitulo-biblioteca">
                        Un espacio para aprender, descubrir y compartir historias.{" "}
                        <span className="badge bg-light text-dark ms-2">
                            Rol: {usuarioActual?.rol || "BIBLIOTECARIO"}
                        </span>
                    </p>
                </div>

                <button
                    className="btn-cerrar-sesion"
                    onClick={onCerrarSesion}
                    title="Cerrar sesión"
                >
                    <LogOut size={18} />
                    <span>Cerrar sesión</span>
                </button>
            </div>

            <CitaDelDia />

            <div className="titulo-secciones">
                <h2>Panel de gestión</h2>
                <p>Seleccioná una sección para comenzar a trabajar o consultá las métricas en tiempo real.</p>
            </div>

            {resumen && (
                <div className="seccion-metricas">
                    <div
                        className="tarjeta-metrica"
                        onClick={() => setMostrarSocios(true)}
                        style={{ cursor: 'pointer' }}
                        title="Ver Socios"
                    >
                        <div className="icono-metrica socios">
                            <UserRoundGroup size={26} />
                        </div>
                        <div className="info-metrica">
                            <span className="titulo-metrica">Socios Activos</span>
                            <span className="valor-metrica socios">{resumen.socios_activos}</span>
                        </div>
                    </div>

                    <div
                        className="tarjeta-metrica"
                        onClick={() => setMostrarLibros(true)}
                        style={{ cursor: 'pointer' }}
                        title="Ver Libros"
                    >
                        <div className="icono-metrica libros">
                            <BookOpen size={26} />
                        </div>
                        <div className="info-metrica">
                            <span className="titulo-metrica">Ejemplares Disponibles</span>
                            <span className="valor-metrica libros">
                                {resumen.ejemplares_disponibles} / {resumen.ejemplares_totales}
                            </span>
                        </div>
                    </div>

                    <div
                        className="tarjeta-metrica"
                        onClick={() => setMostrarPrestamos(true)}
                        style={{ cursor: 'pointer' }}
                        title="Ver Préstamos Activos"
                    >
                        <div className="icono-metrica prestamos">
                            <HandCoins size={26} />
                        </div>
                        <div className="info-metrica">
                            <span className="titulo-metrica">Préstamos Activos</span>
                            <span className="valor-metrica prestamos">{resumen.prestamos_activos}</span>
                        </div>
                    </div>

                    <div
                        className="tarjeta-metrica"
                        onClick={() => setMostrarPagos(true)}
                        style={{ cursor: 'pointer' }}
                        title="Ver Pagos Registrados"
                    >
                        <div className="icono-metrica recaudacion">
                            <CircleDollarSign size={26} />
                        </div>
                        <div className="info-metrica">
                            <span className="titulo-metrica">Recaudación Total</span>
                            <span className="valor-metrica recaudacion">
                                ${Number(resumen.recaudacion_total || 0).toLocaleString('es-AR')}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="seccion-botones">

                <button className="btn-gestion" onClick={() => setMostrarSocios(true)}>
                    <UserRoundGroup />
                    Socios
                </button>

                <button className="btn-gestion" onClick={() => setMostrarLibros(true)}>
                    <BookOpen />
                    Libros
                </button>

                <button className="btn-gestion" onClick={() => setMostrarAutores(true)}>
                    <UserRoundPen />
                    Autores
                </button>

                <button className="btn-gestion" onClick={() => setMostrarPagos(true)}>
                    <CircleDollarSign />
                    Pagos
                </button>

                {esAdmin && (
                    <button className="btn-gestion" onClick={() => setMostrarUsuario(true)}>
                        <UserStar />
                        Usuarios
                    </button>
                )}

                <button className="btn-gestion" onClick={() => setMostrarDevoluciones(true)}>
                    <SquareArrowDownLeftEnter />
                    Devoluciones
                </button>

                <button className="btn-gestion" onClick={() => setMostrarPrestamos(true)}>
                    <HandCoins />
                    Préstamos
                </button>

                <button className="btn-gestion" onClick={() => setMostrarReportes(true)}>
                    <BarChart3 />
                    Reportes
                </button>

            </div>

            <Socios
                mostrar={mostrarSocios}
                cerrar={() => cerrarModalYRefrescar(setMostrarSocios)}
            />

            {mostrarLibros && (
                <Libro cerrar={() => cerrarModalYRefrescar(setMostrarLibros)} esAdmin={esAdmin} />
            )}

            {mostrarAutores && (
                <Autores cerrar={() => cerrarModalYRefrescar(setMostrarAutores)} esAdmin={esAdmin} />
            )}

            {mostrarPagos && (
                <Pagos cerrar={() => cerrarModalYRefrescar(setMostrarPagos)} />
            )}

            {esAdmin && mostrarUsuario && (
                <Usuario cerrar={() => cerrarModalYRefrescar(setMostrarUsuario)} />
            )}

            {mostrarDevoluciones && (
                <Devoluciones cerrar={() => cerrarModalYRefrescar(setMostrarDevoluciones)} />
            )}

            <Prestamos
                mostrar={mostrarPrestamos}
                cerrar={() => cerrarModalYRefrescar(setMostrarPrestamos)}
            />

            {mostrarReportes && (
                <Reportes cerrar={() => cerrarModalYRefrescar(setMostrarReportes)} />
            )}

        </div>
    );
}

export default Dashboard;

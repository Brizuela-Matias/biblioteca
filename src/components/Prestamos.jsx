import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import ModalBase from './common/ModalBase.jsx';
import NavTabs from './common/NavTabs.jsx';
import DataTable from './common/DataTable.jsx';
import SocioSelect from './common/SocioSelect.jsx';

function Prestamos({ mostrar, cerrar }) {
    const [pestana, setPestana] = useState('activos');
    const [prestamos, setPrestamos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargandoPrestamos, setCargandoPrestamos] = useState(false);

    const [socios, setSocios] = useState([]);
    const [libros, setLibros] = useState([]);
    const [dniSeleccionado, setDniSeleccionado] = useState('');
    const [libro, setLibro] = useState('');
    const [fechaPrestamo, setFechaPrestamo] = useState('');
    const [fechaDevolucion, setFechaDevolucion] = useState('');
    const [guardando, setGuardando] = useState(false);

    const hoyStr = new Date().toISOString().split('T')[0];

    const cargarPrestamosActivos = async () => {
        setCargandoPrestamos(true);
        try {
            const data = await apiRequest('/prestamos?estado=ACTIVO');
            setPrestamos(data);
        } catch (error) {
            console.error('Error al cargar préstamos:', error);
        } finally {
            setCargandoPrestamos(false);
        }
    };

    const cargarCatalogos = async () => {
        try {
            const [listaSocios, listaLibros] = await Promise.all([
                apiRequest('/socios'),
                apiRequest('/libros'),
            ]);
            setSocios(listaSocios);
            setLibros(listaLibros);
        } catch (error) {
            console.error('Error al cargar socios o libros:', error);
        }
    };

    useEffect(() => {
        if (!mostrar) return;
        cargarPrestamosActivos();
        cargarCatalogos();
    }, [mostrar]);

    if (!mostrar) return null;

    const devolverPrestamo = async (idPrestamo, tituloLibro, nombreSocio) => {
        const confirmar = window.confirm(
            `¿Registrar devolución del libro "${tituloLibro}" prestado a ${nombreSocio}?`
        );
        if (!confirmar) return;

        try {
            await apiRequest(`/prestamos/${idPrestamo}/devolver`, { method: 'PATCH' });
            alert('Devolución registrada correctamente.');
            await Promise.all([cargarPrestamosActivos(), cargarCatalogos()]);
        } catch (error) {
            alert(error.message);
        }
    };

    async function guardarPrestamo(e) {
        if (e) e.preventDefault();
        if (!dniSeleccionado || !libro.trim() || !fechaPrestamo || !fechaDevolucion) {
            alert('Completá todos los campos');
            return;
        }
        if (fechaDevolucion < fechaPrestamo) {
            alert('La fecha de devolución no puede ser anterior al préstamo');
            return;
        }

        const socioObj = socios.find((s) => s.numero_documento === dniSeleccionado);

        setGuardando(true);
        try {
            const creado = await apiRequest('/prestamos', {
                method: 'POST',
                body: JSON.stringify({
                    nombre_socio: socioObj?.nombre_completo || '',
                    numero_documento: dniSeleccionado,
                    titulo_libro: libro.trim(),
                    fecha_prestamo: fechaPrestamo,
                    fecha_devolucion_pactada: fechaDevolucion,
                }),
            });

            alert(`Préstamo #${creado.id_prestamo} de "${creado.libro_titulo}" registrado para ${creado.socio_nombre}`);
            setDniSeleccionado('');
            setLibro('');
            setFechaPrestamo('');
            setFechaDevolucion('');
            await Promise.all([cargarPrestamosActivos(), cargarCatalogos()]);
            setPestana('activos');
        } catch (error) {
            alert(error.message);
        } finally {
            setGuardando(false);
        }
    }

    const prestamosFiltrados = prestamos.filter((p) => {
        const q = busqueda.toLowerCase().trim();
        if (!q) return true;
        return (
            p.socio_nombre?.toLowerCase().includes(q) ||
            p.socio_dni?.toLowerCase().includes(q) ||
            p.libro_titulo?.toLowerCase().includes(q) ||
            String(p.numero_socio).includes(q)
        );
    });

    const columnas = [
        {
            key: 'id_prestamo',
            header: 'ID',
            cellClassName: 'fw-bold text-center',
            headerClassName: 'text-center',
            render: (p) => `#${p.id_prestamo}`,
        },
        {
            key: 'socio_nombre',
            header: 'Socio',
            render: (p) => (
                <div>
                    <span className="fw-semibold">{p.socio_nombre}</span>
                    <div className="text-muted small">
                        DNI: {p.socio_dni} &bull; Socio #{p.numero_socio}
                    </div>
                </div>
            ),
        },
        {
            key: 'libro_titulo',
            header: 'Libro Prestado',
            cellClassName: 'fw-semibold text-primary',
        },
        {
            key: 'fecha_prestamo',
            header: 'Fecha Préstamo',
            cellClassName: 'text-center',
            headerClassName: 'text-center',
        },
        {
            key: 'fecha_devolucion_pactada',
            header: 'Fecha Vencimiento',
            cellClassName: 'text-center',
            headerClassName: 'text-center',
            render: (p) => {
                const vencido = p.fecha_devolucion_pactada < hoyStr;
                return (
                    <span className={vencido ? 'text-danger fw-bold' : ''}>
                        {p.fecha_devolucion_pactada}
                        {vencido && <span className="badge bg-danger ms-1">Vencido</span>}
                    </span>
                );
            },
        },
        {
            key: 'estado',
            header: 'Estado',
            cellClassName: 'text-center',
            headerClassName: 'text-center',
            render: (p) => {
                const vencido = p.fecha_devolucion_pactada < hoyStr;
                return (
                    <span className={`badge ${vencido ? 'bg-danger' : 'bg-success'}`}>
                        {vencido ? 'VENCIDO' : 'ACTIVO'}
                    </span>
                );
            },
        },
        {
            key: 'acciones',
            header: 'Acción',
            cellClassName: 'text-center',
            headerClassName: 'text-center',
            render: (p) => (
                <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => devolverPrestamo(p.id_prestamo, p.libro_titulo, p.socio_nombre)}
                    title="Registrar devolución de este libro"
                >
                    Devolver
                </button>
            ),
        },
    ];

    const tabs = [
        { id: 'activos', label: `Préstamos Activos (${prestamos.length})` },
        { id: 'nuevo', label: '+ Registrar Nuevo Préstamo' },
    ];

    const footer = (
        <>
            <button className="btn btn-secondary" onClick={cerrar}>
                Cerrar
            </button>
            {pestana === 'activos' ? (
                <button className="btn btn-success" onClick={() => setPestana('nuevo')}>
                    + Nuevo préstamo
                </button>
            ) : (
                <button className="btn btn-success" onClick={guardarPrestamo} disabled={guardando}>
                    {guardando ? 'Registrando...' : 'Registrar préstamo'}
                </button>
            )}
        </>
    );

    return (
        <ModalBase
            titulo="Gestión de Préstamos"
            cerrar={cerrar}
            size="modal-xl"
            headerExtra={<NavTabs tabs={tabs} activeTab={pestana} onChange={setPestana} />}
            footer={footer}
        >
            {pestana === 'activos' ? (
                <div>
                    <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
                        <div className="flex-grow-1" style={{ maxWidth: '400px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por socio, DNI o libro..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={cargarPrestamosActivos}
                                disabled={cargandoPrestamos}
                            >
                                {cargandoPrestamos ? 'Actualizando...' : 'Actualizar'}
                            </button>
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => setPestana('nuevo')}
                            >
                                + Registrar préstamo
                            </button>
                        </div>
                    </div>

                    <DataTable
                        columns={columnas}
                        data={prestamosFiltrados}
                        keyField="id_prestamo"
                        loading={cargandoPrestamos}
                        loadingMessage="Cargando préstamos activos..."
                        emptyMessage={
                            busqueda
                                ? 'No se encontraron préstamos que coincidan con la búsqueda.'
                                : 'No hay préstamos activos en este momento.'
                        }
                    />
                </div>
            ) : (
                <form onSubmit={guardarPrestamo}>
                    <SocioSelect socios={socios} value={dniSeleccionado} onChange={setDniSeleccionado} />

                    <label className="mb-1">Libro a prestar</label>
                    <input
                        className="form-control mb-3"
                        list="catalogo-libros-prestamo"
                        placeholder="Escribí o seleccioná el título del libro..."
                        value={libro}
                        onChange={(e) => setLibro(e.target.value)}
                    />
                    <datalist id="catalogo-libros-prestamo">
                        {libros.map((l) => (
                            <option key={l.id_libro} value={l.titulo}>
                                {l.titulo} (Disponibles: {l.stock_disponible}/{l.stock_total})
                            </option>
                        ))}
                    </datalist>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Fecha del préstamo</label>
                            <input
                                type="date"
                                className="form-control"
                                value={fechaPrestamo}
                                onChange={(e) => setFechaPrestamo(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Fecha de devolución pactada</label>
                            <input
                                type="date"
                                className="form-control"
                                value={fechaDevolucion}
                                onChange={(e) => setFechaDevolucion(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            )}
        </ModalBase>
    );
}

export default Prestamos;

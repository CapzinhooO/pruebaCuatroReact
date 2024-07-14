import React, { Fragment, useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Productos = () => {
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [categoriaBusqueda, setCategoriaBusqueda] = useState('');
    const [precioBusqueda, setPrecioBusqueda] = useState('');
    const [nuevoProducto, setNuevoProducto] = useState('');
    const [imagenNuevoProducto, setImagenNuevoProducto] = useState('');
    const [categoriaNuevoProducto, setCategoriaNuevoProducto] = useState('');
    const [precioNuevoProducto, setPrecioNuevoProducto] = useState('');
    const [productos, setProductos] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('');
    const [productoValido, setProductoValido] = useState({
        nuevoProducto: false,
        imagenNuevoProducto: false,
        categoriaNuevoProducto: false,
        precioNuevoProducto: false
    });
    const [productoEditando, setProductoEditando] = useState(null);

    useEffect(() => {
        const productosAlmacenados = localStorage.getItem('productos');
        if (productosAlmacenados) {
            setProductos(JSON.parse(productosAlmacenados));
            setResultados(JSON.parse(productosAlmacenados));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('productos', JSON.stringify(productos));
    }, [productos]);

    useEffect(() => {
        const esValido =
            nuevoProducto.trim() !== '' &&
            imagenNuevoProducto.trim() !== '' &&
            categoriaNuevoProducto !== '' &&
            precioNuevoProducto.trim() !== '';
        
        setProductoValido({
            nuevoProducto: nuevoProducto.trim() !== '',
            imagenNuevoProducto: imagenNuevoProducto.trim() !== '',
            categoriaNuevoProducto: categoriaNuevoProducto !== '',
            precioNuevoProducto: precioNuevoProducto.trim() !== ''
        });
    }, [nuevoProducto, imagenNuevoProducto, categoriaNuevoProducto, precioNuevoProducto]);

    const manejarBusqueda = () => {
        if (terminoBusqueda.trim() === '' && categoriaBusqueda === '' && precioBusqueda.trim() === '') {
            setMensajeAlerta('Ingrese al menos un criterio de búsqueda');
            setTipoAlerta('danger');
            return;
        }

        const resultadosFiltrados = productos.filter(producto =>
            (terminoBusqueda ? producto.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) : true) &&
            (categoriaBusqueda ? producto.category.toLowerCase().includes(categoriaBusqueda.toLowerCase()) : true) &&
            (precioBusqueda ? producto.price <= parseFloat(precioBusqueda) : true)
        );
        setResultados(resultadosFiltrados);
        if (resultadosFiltrados.length === 0) {
            setMensajeAlerta('No se encontraron productos');
            setTipoAlerta('danger');
        } else {
            setMensajeAlerta('');
        }
    };

    const manejarAgregarProducto = () => {
        if (
            nuevoProducto.trim() === '' ||
            imagenNuevoProducto.trim() === '' ||
            categoriaNuevoProducto === '' ||
            precioNuevoProducto.trim() === ''
        ) {
            setMensajeAlerta('Todos los campos son obligatorios');
            setTipoAlerta('danger');
            return;
        }

        const esNombreProductoValido = /^[A-Za-z ]+$/.test(nuevoProducto);
        if (!esNombreProductoValido) {
            setMensajeAlerta('El nombre del producto solo puede contener letras y espacios');
            setTipoAlerta('danger');
            return;
        }

        const nuevoProductoObj = {
            name: nuevoProducto,
            image: imagenNuevoProducto,
            category: categoriaNuevoProducto,
            price: parseFloat(precioNuevoProducto)
        };

        if (productoEditando !== null) {
            const productosActualizados = productos.map(producto => (
                producto === productoEditando ? { ...nuevoProductoObj } : producto
            ));
            setProductos(productosActualizados);
            setResultados(productosActualizados);
            setProductoEditando(null);
            setMensajeAlerta('Producto editado exitosamente');
            setTipoAlerta('success');
        } else {
            const productosActualizados = [...productos, nuevoProductoObj];
            setProductos(productosActualizados);
            setResultados(productosActualizados);
            setMensajeAlerta('Producto agregado exitosamente');
            setTipoAlerta('success');
        }

        setNuevoProducto('');
        setImagenNuevoProducto('');
        setCategoriaNuevoProducto('');
        setPrecioNuevoProducto('');
    };

    const manejarEliminarProducto = (productoAEliminar) => {
        const productosActualizados = productos.filter(producto => producto !== productoAEliminar);
        setProductos(productosActualizados);
        setResultados(productosActualizados);
        setMensajeAlerta('Producto eliminado exitosamente');
        setTipoAlerta('success');
    };

    const empezarEditarProducto = (producto) => {
        setProductoEditando(producto);
        setNuevoProducto(producto.name);
        setImagenNuevoProducto(producto.image);
        setCategoriaNuevoProducto(producto.category);
        setPrecioNuevoProducto(producto.price.toString());
    };

    return (
        <Fragment>
            <div className="container-fluid" style={{
                backgroundImage: "linear-gradient(180deg, #a6ffff 0, #a2edff 25%, #9dd5f2 50%, #96bed5 75%, #8ea8b9 100%)",
                minHeight: "100vh",
                paddingTop: "20px"
            }}>
                <div className="container">
                    <h1 className="display-5 my-3 text-center">Lista de productos</h1>

                    {mensajeAlerta && (
                        <div className={`alert alert-${tipoAlerta}`} role="alert">
                            {mensajeAlerta}
                        </div>
                    )}

                    <div className='mb-5'>
                        <h2 className="h4 text-center">{productoEditando ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
                        <div className='row g-3 my-3'>
                            <div className={`col-md-6 col-lg-3 ${productoValido.nuevoProducto ? 'has-success' : 'has-danger'}`}>
                                <input
                                    type="text"
                                    className={`form-control ${productoValido.nuevoProducto ? 'is-valid' : 'is-invalid'}`}
                                    placeholder="Nuevo producto"
                                    value={nuevoProducto}
                                    onChange={(e) => setNuevoProducto(e.target.value)}
                                    pattern="[A-Za-z ]*"
                                    title="Solo se permiten letras y espacios"
                                />
                            </div>
                            <div className={`col-md-6 col-lg-3 ${productoValido.imagenNuevoProducto ? 'has-success' : 'has-danger'}`}>
                                <input
                                    type="text"
                                    className={`form-control ${productoValido.imagenNuevoProducto ? 'is-valid' : 'is-invalid'}`}
                                    placeholder="URL de la imagen"
                                    value={imagenNuevoProducto}
                                    onChange={(e) => setImagenNuevoProducto(e.target.value)}
                                />
                            </div>
                            <div className={`col-md-6 col-lg-3 ${productoValido.categoriaNuevoProducto ? 'has-success' : 'has-danger'}`}>
                                <select
                                    className={`form-control ${productoValido.categoriaNuevoProducto ? 'is-valid' : 'is-invalid'}`}
                                    value={categoriaNuevoProducto}
                                    onChange={(e) => setCategoriaNuevoProducto(e.target.value)}
                                >
                                    <option value="">Seleccione una categoría</option>
                                    <option value="Comida">Comida</option>
                                    <option value="Aseo">Aseo</option>
                                    <option value="Ropa">Ropa</option>
                                    <option value="Electrónica">Electrónica</option>
                                </select>
                            </div>
                            <div className={`col-md-6 col-lg-2 ${productoValido.precioNuevoProducto ? 'has-success' : 'has-danger'}`}>
                                <input
                                    type="number"
                                    className={`form-control ${productoValido.precioNuevoProducto ? 'is-valid' : 'is-invalid'}`}
                                    placeholder="Precio"
                                    value={precioNuevoProducto}
                                    onChange={(e) => setPrecioNuevoProducto(e.target.value)}
                                />
                            </div>
                            <div className='col-md-6 col-lg-1'>
                                <button
                                    className='btn btn-outline-success w-100'
                                    onClick={manejarAgregarProducto}
                                >
                                    <i className={productoEditando ? "bi bi-pencil" : "bi bi-plus-circle-fill"}>Agregar Producto</i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='mb-5'>
                        <h2 className="h4 text-center">Buscar Productos</h2>
                        <div className='row g-3 my-3'>
                            <div className='col-md-6 col-lg-4'>
                                <input
                                    type="text"
                                    className='form-control'
                                    placeholder="Buscar por nombre"
                                    value={terminoBusqueda}
                                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                                />
                            </div>
                            <div className='col-md-6 col-lg-4'>
                                <select
                                    className='form-control'
                                    value={categoriaBusqueda}
                                    onChange={(e) => setCategoriaBusqueda(e.target.value)}
                                >
                                    <option value="">Buscar por categoría</option>
                                    <option value="Comida">Comida</option>
                                    <option value="Aseo">Aseo</option>
                                    <option value="Ropa">Ropa</option>
                                    <option value="Electrónica">Electrónica</option>
                                </select>
                            </div>
                            <div className='col-md-6 col-lg-3'>
                                <input
                                    type="number"
                                    className='form-control'
                                    placeholder="Buscar por precio máximo"
                                    value={precioBusqueda}
                                    onChange={(e) => setPrecioBusqueda(e.target.value)}
                                />
                            </div>
                            <div className='col-md-6 col-lg-1'>
                                <button
                                    className='btn btn-outline-success w-100'
                                    onClick={manejarBusqueda}
                                >
                                    <i className="bi bi-search"></i> Buscar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {resultados.length > 0 ? (
                            resultados.map((resultado, index) => (
                                <div key={index} className="col-md-6 col-lg-4 mb-4">
                                    <div className="card h-100">
                                        <img src={resultado.image} className="card-img-top" alt={resultado.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{resultado.name}</h5>
                                            <p className="card-text">{resultado.category}</p>
                                            <p className="card-text">${resultado.price}</p>
                                            <div className="d-flex justify-content-between">
                                                <button
                                                    className='btn btn-outline-danger btn-sm'
                                                    onClick={() => manejarEliminarProducto(resultado)}
                                                >
                                                    <i className="bi bi-trash3-fill"></i>
                                                </button>
                                                <button
                                                    className='btn btn-outline-primary btn-sm'
                                                    onClick={() => empezarEditarProducto(resultado)}
                                                >
                                                    <i className="bi bi-pencil"></i> Editar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <div className="alert alert-warning" role="alert">
                                    No se encontraron productos
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Productos;

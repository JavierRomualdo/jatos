import { Empresa } from '../entidades/entidad.empresa';

export class LS {
  //KEYS
  public static KEY_CONTRATO_SELECT = "";
  public static KEY_PROPIEDAD_SELECT = "";
  public static KEY_EMPRESA_SELECT: Empresa;
  public static KEY_CURRENT_USER = "currentUser";
  public static KEY_FOTO_PERFIL = "fotoPerfil";
  public static KEY_IS_PERFIL_USER: boolean = false;
  public static KEY_NOTIFICACIONES: any = [];
  //ICONOS PARA BOTONES
  public static ICON_ACTIVO = "fa fa-check-square-o";
  public static ICON_ARCHIVO = "fa fa-file";
  public static ICON_INACTIVO = "fa fa-square-o";
  public static ICON_BUSCAR = "fa fa-search";
  public static ICON_BUSCAR_MAS = "fa fa-search-plus";
  public static ICON_CONSULTAR = "fa fa-search";
  public static ICON_FILTRAR = "fa fa-filter";
  public static ICON_GUARDAR = "fa fa-save";
  public static ICON_NUEVO = "fa fa-plus-square";
  public static ICON_EDITAR = "fa fa-pencil-square-o";
  public static ICON_CANCELAR = "fa fa-times";
  public static ICON_REGRESAR = "fa fa-undo";
  public static ICON_ELIMINAR = "fa fa-trash";
  public static ICON_NOTIFICACION = "fa fa-bell-o";
  public static ICON_OCULTAR_FILTRO = "fa fa-chevron-left";
  public static ICON_MOSTRAR_FILTRO = "fa fa-chevron-right";
  public static ICON_OPCIONES = "fa fa-wrench";
  public static ICON_IMPRIMIR = "fa fa-print";
  public static ICON_EXPORTAR = "fa fa-download";
  public static ICON_INACTIVAR = "fa fa-times-circle";
  public static ICON_VENTA = "fa fa-shopping-cart";
  public static ICON_ALQUILER = "fa fa-key";
  public static ICON_LIBRE = "fa fa-check";
  public static ICON_RESERVADO = "fa fa-user-secret";
  public static ICON_ACTIVAR = "fa fa-check-circle";
  public static ICON_SELECCIONAR = 'fa fa-check';
  public static ICON_MAIL = 'fa fa-envelope-o';
  public static ICON_MARKER = 'fa fa-map-marker';
  public static ICON_EYE = 'fa fa-eye';
  public static ICON_EYE_SLASH = 'fa fa-eye-slash';
  
  //TAGS
  static TAG_AVISO = "Aviso";
  static TAG_ARCHIVO = "Archivo";
  static TAG_AREA = "Área";
  static TAG_ALQUILADO = "Alquilado";
  static TAG_ALQUILADAS = "Alquiladas";
  static TAG_CONTRATO = "Contrato";
  static TAG_PRE_CONTRATO = "Pre - contrato";
  static TAG_VENDIDO = "Vendido";
  static TAG_VENDIDAS = "Vendidas";
  static TAG_RESERVADO = "Reservado";
  static TAG_RESERVADAS = "Reservadas";
  static TAG_LIBRE = "Libre";
  static TAG_LIBRES = "Libres";
  static TAG_FILTRAR = "Filtrar";
  static TAG_IMAGEN = "Imagen";
  static TAG_SELECCIONE = "Seleccione";
  static TAG_ACTIVO = "Activo";
  static TAG_ACTIVOS = "Activos";
  static TAG_EXITO = "Exito";
  static TAG_INACTIVO = "Inactivo";
  static TAG_INCLUIR_INACTIVOS = "Incluir inactivos";
  static TAG_APARTAMENTO = 'Apartamento';
  static TAG_APARTAMENTO_LISTADO = 'Listado de apartamentos';
  static TAG_CASA = "Casa";
  static TAG_CASAS_LISTADO = "Listado de casas";
  static TAG_COCHERA = "Cochera";
  static TAG_COCHERA_LISTADO = "Listado de cocheras";
  static TAG_HABITACION = "Habitación";
  static TAG_HABITACION_LISTADO = "Listado de habitaciones";
  static TAG_LOCAL = "Local";
  static TAG_LOCAL_LISTADO = "Listado de locales";
  static TAG_LOTE = "Lote";
  static TAG_LOTE_LISTADO = "Listado de lotes";
  static TAG_MENSAJE_LISTADO = "Listado de mensajes";
  static TAG_PROPIEDAD = "Propiedad";
  static TAG_PROPIETARIO = "Propietario";
  static TAG_CLIENTE = "Cliente";
  static TAG_DATOS_GENERALES = "Datos generales";
  static TAG_TIPO_CONTRATO = "Tipo contrato";
  static TAG_VENTA = "Venta";
  static TAG_ALQUILER = "Alquiler";
  static TAG_FOTO_PRINCIPAL = "Foto principal";
  static TAG_LARGO_MTS = "Largo mts.";
  static TAG_ANCHO_MTS = "Ancho mts.";
  static TAG_CODIGO = "Código";
  static TAG_COSTO = "Costo";
  static TAG_PRECIO = "Precio";
  static TAG_PRECIO_COMPRA = "Precio compra";
  static TAG_PRECIO_ADQUISICION = "Precio adquisición";
  static TAG_PRECIO_CONTRATO = "Precio contrato";
  static TAG_GANANCIA = "Ganancia";
  static TAG_PRECIO_S = "Precio (S/)";
  static TAG_UBIGEO = "Ubigeo";
  static TAG_DIRECCION = "Dirección";
  static TAG_CAMAS = "Camas";
  static TAG_PISOS = "Pisos";
  static TAG_CUARTOS = "Cuartos";
  static TAG_HABITACIONES = "Habitacciones";
  static TAG_BANIOS = "Baños";
  static TAG_BANIO_PREG = "¿Baño?";
  static TAG_JARDIN_PREG = "¿Jardin?";
  static TAG_COCHERA_PREG = "¿Cochera?";
  static TAG_REFERENCIA = "Referencia";
  static TAG_DESCRIPCION = "Descripcion";
  static TAG_MAS_OPCIONES = "Más opciones";
  static TAG_IMAGENES = "Imágenes";
  static TAG_SERVICIO = "Servicio";
  static TAG_SERVICIOS = "Servicios";
  static TAG_OPCIONES = "Opciones";
  static TAG_UBICACION = "Ubicación";
  static TAG_GENERAL = "General";
  static TAG_FECHA_VENTA = "Fecha venta";
  static TAG_FECHA_ALQUILER = "Fecha alquiler";
  static TAG_FECHA_CONTRATO = "Fecha contrato";
  static TAG_DESDE = "Desde";
  static TAG_HASTA = "Hasta";
  static TAG_PENDIENTES = 'Pendientes';
  static TAG_ANULADOS = 'Anulados';
  static TAG_REVERSADOS = 'Reversados';
  static TAG_LUN = 'Lun';
  static TAG_LUNES = 'Lunes';
  static TAG_MAR = 'Mar';
  static TAG_MARTES = 'Martes';
  static TAG_MIE = 'Mié';
  static TAG_MIERCOLES = 'Miércoles';
  static TAG_JUE = 'Jue';
  static TAG_JUEVES = 'Jueves';
  static TAG_VIE = 'Vie';
  static TAG_VIERNES = 'Viernes';
  static TAG_SAB = 'Sáb';
  static TAG_SABADO = 'Sábado';
  static TAG_DOM = "Dom";
  static TAG_DOMINGO = "Domingo";
  static TAG_MOSTRAR_OCULTAR = "Ocultar/Mostrar";
  static TAG_NOMBRE = "Nombre";
  static TAG_NOMBRES = "Nombres";
  static TAG_MENSAJE = "Mensaje";
  static TAG_MENSAJES = "Mensajes";
  static TAG_TELEFONO = "Teléfono";
  static TAG_EMAIL = "Email";
  static TAG_TITULO = "Titulo";
  static TAG_ESTADO = "Estado";
  static TAG_DATOS_PERSONALES = "Datos personales";
  static TAG_LATITUD = "Latitud";
  static TAG_LONGITUD = "Longitud";
  static TAG_MAPA = "Mapa";
  static TAG_EMPRESA = 'Empresa';
  static TAG_RUC = 'Ruc';
  static TAG_USUARIO = 'Usuario';
  static TAG_USUARIOS_LISTADO = "Listado de usuarios";
  static TAG_NUEVA_CONTRASENA = 'Contraseña';
  static TAG_CONFIRMAR_CONTRASENA = 'Confirmar contraseña';
  static TAG_DNI = 'Dni';
  static TAG_ROL = 'Rol';
  static TAG_MANTENIMIENTO_PERSONAS = 'Mantenimiento de personas';
  static TAG_PERSONAS_LISTADO = 'Listado de personas';
  static TAG_MANTENIMIENTO_SERVICIOS = 'Mantenimiento de servicios';
  static TAG_SERVICIOS_LISTADO = 'Listado de servicios';
  static TAG_MAS_DATOS = 'Más datos';
  static TAG_ROLES = 'Roles';
  static TAG_DETALLE = 'Detalle';

  //LABELS
  public static LABEL_ACTUALIZAR = "Actualizar";
  public static LABEL_ACEPTAR = "Aceptar";
  public static LABEL_BUSCAR = "Buscar";
  public static LABEL_NUEVO = "Nuevo";
  public static LABEL_GUARDAR = "Guardar";
  public static LABEL_EDITAR = "Editar";
  public static LABEL_CANCELAR = "Cancelar";
  public static LABEL_LIMPIAR = "Limpiar";
  public static LABEL_REGRESAR = "Regresar";
  public static LABEL_IMPRIMIR = "Imprimir";
  public static LABEL_EXPORTAR = "Exportar";

  //ATAJOS
  public static ATAJO_ACEPTAR = "alt+s";
  public static ATAJO_NUEVO = "alt+n";
  public static ATAJO_EDITAR = "alt+r";
  public static ATAJO_GUARDAR = "alt+g";
  public static ATAJO_ELIMINAR = "alt+e";
  public static ATAJO_IMPRIMIR = "alt+p";
  public static ATAJO_EXPORTAR = "alt+i";
  public static ATAJO_MOSTRAR_OCULTAR_FILTROS = "alt+enter";

  // TOAST
  public static TOAST_ERROR = 'Error';
  public static TOAST_ADVERTENCIA = 'Advertencia';
  public static TOAST_CORRECTO = 'Correcto';

  //ACCIONES
  static ACCION_CANCELAR = "Cancelar";
  static ACCION_CONSULTAR = "Consultar";
  static ACCION_EDITAR = "Editar";
  static ACCION_INACTIVAR = "Inactivar";
  static ACCION_ACTIVAR = "Activar";
  static ACCION_ELIMINAR = "Eliminar";
  static ACCION_IMPRIMIR = "Imprimir";
  static ACCION_EXPORTAR = "Exportar";
  static ACCION_NUEVO = "Nuevo";
  static ACCION_SELECCIONAR = 'SELECCIONAR';
  static ACCION_VER_ALQUILER = 'Ver alquiler';
  static ACCION_VER_VENTA = 'Ver venta';
  static ACCION_ENVIAR_CORREO = "Enviar correo";

  //ETIQUETAS
  static ETIQUETA_TODOS = "TODOS";
  static ETIQUETA_PENDIENTES = "PENDIENTES";
  static ETIQUETA_ANULADOS = "ANULADOS";
  static ETIQUETA_RESERVADOS = "RESERVADOS";

  //TITULOS DE CARDS
  public static TITULO_FILTROS = 'Filtros';
  public static TITULO_FORM_NUEVA_CASA = "Nueva casa";
  public static TITULO_FORM_EDITAR_CASA = "Editar casa";
  public static TITULO_FORM_CONSULTAR_CASA = "Consultar casa";
  public static TITULO_FORM_NUEVO_LOTE = "Nuevo lote";
  public static TITULO_FORM_EDITAR_LOTE = "Editar lote";
  public static TITULO_FORM_CONSULTAR_LOTE = 'Consultar lote'
  public static TITULO_FORM_NUEVA_HABITACION = "Nueva habitación";
  public static TITULO_FORM_EDITAR_HABITACION = "Editar habitación";
  public static TITULO_FORM_CONSULTAR_HABITACION = "Consultar habitación";
  public static TITULO_FORM_NUEVO_LOCAL = "Nuevo local";
  public static TITULO_FORM_EDITAR_LOCAL = "Editar local";
  public static TITULO_FORM_CONSULTAR_LOCAL = "Consultar local";
  public static TITULO_FORM_NUEVA_COCHERA = "Nueva cochera";
  public static TITULO_FORM_EDITAR_COCHERA = "Editar cochera";
  public static TITULO_FORM_CONSULTAR_COCHERA = "Concultar cochera";
  public static TITULO_FORM_NUEVO_APARTAMENTO = "Nuevo apartamento";
  public static TITULO_FORM_EDITAR_APARTAMENTO = "Editar apartamento";
  public static TITULO_FORM_CONSULTAR_APARTAMENTO = "Consultar apartamento";
  public static TITULO_FORM_NUEVA_VENTA = "Nueva venta";
  public static TITULO_FORM_EDITAR_VENTA = "Editar venta";
  public static TITULO_FORM_CONSULTAR_VENTA = "Consultar venta";
  public static TITULO_VENTAS_LISTADO = "Listado de ventas";
  public static TITULO_FORM_NUEVO_ALQUILER = "Nuevo alquiler";
  public static TITULO_FORM_EDITAR_ALQUILER = "Editar alquiler";
  public static TITULO_FORM_CONSULTAR_ALQUILER = "Consultar alquiler";
  public static TITULO_ALQUILERES_LISTADO = "Listado de alquileres";
  public static TITULO_FORM_CONSULTAR_MENSAJE = "Consultar mensaje";
  public static TITULO_FORM_ENVIAR_MENSAJE = "Enviar mensaje";
  public static TITULO_FORM_NUEVO_USUARIO = "Nuevo usuario";
  public static TITULO_FORM_EDITAR_USUARIO = "Editar usuario";
  public static TITULO_FORM_CONSULTAR_USUARIO = "Consultar usuario";
  public static TITULO_CONFIGURACION_GENERAL_CUENTA = 'Configuración general de la cuenta';
  public static TITULO_SEGURIDAD_INICIO_SESION = 'Seguridad e inicio de sesión';
  public static TITULO_FORM_NUEVA_PERSONA = 'Nueva persona';
  public static TITULO_FORM_EDITAR_PERSONA = 'Editar persona';
  public static TITULO_FORM_CONSULTAR_PERSONA = 'Consultar persona';
  public static TITULO_FORM_NUEVO_SERVICIO = 'Nuevo servicio';
  public static TITULO_FORM_EDITAR_SERVICIO = 'Editar servicio';
  public static TITULO_FORM_CONSULTAR_SERVICIO = 'Consultar servicio';
  
  //MENSAJES
  static MSJ_COLUMNAS = "columnas seleccionadas";
  static MSJ_PREGUNTA_INACTIVAR = "¿Está seguro que desea inactivar?";
  static MSJ_PREGUNTA_ACTIVAR = "¿Está seguro que desea activar?";
  static MSJ_TITULO_ELIMINAR = "¿Está seguro?";
  static MSJ_PREGUNTA_ELIMINAR = "Una vez eliminado no se podrá recuperar.";
  static MSJ_SI_ACEPTAR = "Sí, Aceptar";
  static MSJ_SI_ELIMINAR = "Sí, eliminar";
  static MSJ_CANCELAR = "Cancelar";
  static MSJ_ATRIBUTO_AREA_PROPIEDAD = "Atributo para el área de la propiedad.";
  static MSJ_CAMPOS_INVALIDOS = 'Verifique los datos ingresados.';
  static MSJ_TITULO_INVALIDOS = 'Datos inválidos';
  static MSJ_RUC = 'Este atributo es fundamental, se recomienda no cambiarlo.';
  static MSJ_USUARIO_CLAVE_NO_INGRESADA = 'Usuario o clave no ingresados.';
  static MSJ_DOC_GENERADO = 'Documento generado correctamente';
  static MSJ_NO_DATA = 'No se encontraron resultados';
  static MSJ_ERROR_IMPRIMIR = 'El reporte no existe o tiene errores';
  
  //Swal;
  public static SWAL_CORRECTO = "Correcto!";
  public static SWAL_INCORRECTO = "Error!";
  public static SWAL_OK = "Ok";
  public static SWAL_QUESTION = "question";
  public static SWAL_SUCCESS = "success";
  public static SWAL_WARNING = "warning";
  public static SWAL_INFO = "info";
  public static SWAL_ERROR = "error";

  // COLORES
  public static COLOR_ELIMINAR = "#DD3333";
  public static WIDTH_OPCIONES = 80;

  //Medidas pantalla
  public static WINDOW_WIDTH_XS = 576;
  // LISTAS
  static LISTA_PROPIEDADES = [
    // "Apartamento",
    "Casa",
    "Cochera",
    "Habitación",
    "Local",
    "Lote"
  ];

  static LISTA_PROPIEDADES_VENTA = [
    // "Apartamento",
    "Casa",
    "Local",
    "Lote"
  ];
  static LISTA_RANGO_PRECIOS = [
    {
      id: 0,
      precionminimo: '0',
      preciomaximo: '5000',
      detalle: 'Por menos de S/ 5000.00'
    },
    {
      id: 1,
      precionminimo: '5000',
      preciomaximo: '15000',
      detalle: 'S/ 5000.00 - S/ 15000.00'
    },
    {
      id: 2,
      precionminimo: '15000',
      preciomaximo: '2000000',
      detalle: 'Por más de S/ 15000.00'
    }
  ];
  static LISTA_CONTRATO = ["A", "V"];
}

export class DateValidity {
  id: number;
  idProveedor: number;
  fecha_inicio: string;
  fecha_fin: string;

  constructor(params: {
    id: number;
    idProveedor: number;
    fecha_inicio: string;
    fecha_fin: string;
  }) {
    if (!params.id) throw new Error("El ID es obligatorio");
    if (!params.idProveedor) throw new Error("El ID del proveedor es obligatorio");

    // Validaciones de negocio
    if (new Date(params.fecha_inicio) > new Date(params.fecha_fin)) {
      throw new Error("La fecha de inicio no puede ser mayor que la fecha de fin");
    }

    this.id = params.id;
    this.idProveedor = params.idProveedor;
    this.fecha_inicio = params.fecha_inicio;
    this.fecha_fin = params.fecha_fin;
  }
}

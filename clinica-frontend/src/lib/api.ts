// lib/api.ts - Cliente HTTP centralizado para consumir el backend

import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor para agregar token JWT en cada request
    this.api.interceptors.request.use((config) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores 401 (token expirado)
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expirado, redirigir a login
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // AUTH ENDPOINTS
  async registrarUsuario(email: string, password: string, rol: string) {
    const response = await this.api.post("/auth/registro", {
      email,
      password,
      rol,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post("/auth/login", {
      username: email, // FastAPI OAuth2 usa 'username'
      password,
    }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      transformRequest: (data) => {
        const params = new URLSearchParams();
        params.append("username", email);
        params.append("password", password);
        return params.toString();
      },
    });
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
    }
    return response.data;
  }

  // PACIENTES ENDPOINTS
  async listarPacientes() {
    const response = await this.api.get("/pacientes");
    return response.data;
  }

  async obtenerPaciente(id: number) {
    const response = await this.api.get(`/pacientes/${id}`);
    return response.data;
  }

  async crearPaciente(datos: {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    fecha_nacimiento?: string;
    direccion?: string;
  }) {
    const response = await this.api.post("/pacientes", datos);
    return response.data;
  }

  async actualizarPaciente(id: number, datos: any) {
    const response = await this.api.put(`/pacientes/${id}`, datos);
    return response.data;
  }

  async eliminarPaciente(id: number) {
    await this.api.delete(`/pacientes/${id}`);
  }

  async obtenerEstadoCuenta(id: number) {
    const response = await this.api.get(`/pacientes/${id}/estado-cuenta`);
    return response.data;
  }

  // HISTORIA CLINICA ENDPOINTS
  async listarHistorias(pacienteId: number) {
    const response = await this.api.get(`/pacientes/${pacienteId}/historias`);
    return response.data;
  }

  async obtenerHistoria(historiaId: number) {
    const response = await this.api.get(`/historias/${historiaId}`);
    return response.data;
  }

  async crearHistoria(pacienteId: number, datos: any) {
    const response = await this.api.post(`/pacientes/${pacienteId}/historias`, datos);
    return response.data;
  }

  async actualizarHistoria(historiaId: number, datos: any) {
    const response = await this.api.put(`/historias/${historiaId}`, datos);
    return response.data;
  }

  // ODONTOGRAMA ENDPOINTS
  async obtenerOdontograma(id: number) {
    const response = await this.api.get(`/pacientes/${id}/odontograma`);
    return response.data;
  }

  async actualizarDiente(pacienteId: number, dienteId: number, datos: any) {
    const response = await this.api.put(
      `/pacientes/${pacienteId}/odontograma/${dienteId}`,
      datos
    );
    return response.data;
  }

  async resetOdontograma(pacienteId: number) {
    const response = await this.api.post(`/pacientes/${pacienteId}/odontograma/reset`);
    return response.data;
  }

  // CITAS ENDPOINTS
  async listarCitas() {
    const response = await this.api.get("/citas");
    return response.data;
  }

  async obtenerAgenda(dentistId: number) {
    const response = await this.api.get(`/citas/agenda/${dentistId}`);
    return response.data;
  }

  async crearCita(datos: any) {
    const response = await this.api.post("/citas", datos);
    return response.data;
  }

  async actualizarCita(id: number, datos: any) {
    const response = await this.api.put(`/citas/${id}`, datos);
    return response.data;
  }

  async eliminarCita(id: number) {
    await this.api.delete(`/citas/${id}`);
  }

  // TRATAMIENTOS ENDPOINTS
  async crearTratamiento(pacienteId: number, datos: any) {
    const response = await this.api.post(
      `/pacientes/${pacienteId}/tratamientos`,
      datos
    );
    return response.data;
  }

  async obtenerTratamientos(pacienteId: number) {
    const response = await this.api.get(
      `/pacientes/${pacienteId}/tratamientos`
    );
    return response.data;
  }

  // ARCHIVOS ENDPOINTS
  async subirArchivo(pacienteId: number, file: File, tipo: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tipo", tipo);

    const response = await this.api.post(
      `/pacientes/${pacienteId}/archivos/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  }

  async obtenerArchivos(pacienteId: number) {
    const response = await this.api.get(`/pacientes/${pacienteId}/archivos`);
    return response.data;
  }

  async descargarArchivo(archivoId: number) {
    const response = await this.api.get(`/archivos/${archivoId}/download`);
    return response.data;
  }

  // CONSENTIMIENTOS ENDPOINTS
  async crearConsentimiento(pacienteId: number, tipoTratamiento: string) {
    const response = await this.api.post(
      `/pacientes/${pacienteId}/consentimientos`,
      { tipo_tratamiento: tipoTratamiento }
    );
    return response.data;
  }

  async obtenerConsentimientos(pacienteId: number) {
    const response = await this.api.get(
      `/pacientes/${pacienteId}/consentimientos`
    );
    return response.data;
  }

  async firmarConsentimiento(consentimientoId: number, firma: string) {
    const response = await this.api.put(
      `/consentimientos/${consentimientoId}/firmar`,
      { firma_digital: firma }
    );
    return response.data;
  }

  // FINANZAS ENDPOINTS
  async registrarTransaccion(pacienteId: number, datos: any) {
    const response = await this.api.post(
      `/pacientes/${pacienteId}/transacciones`,
      datos
    );
    return response.data;
  }

  async obtenerTransacciones(pacienteId: number) {
    const response = await this.api.get(
      `/pacientes/${pacienteId}/transacciones`
    );
    return response.data;
  }

  async cerrarArqueoCaja(datos: any) {
    const response = await this.api.post("/caja/arqueo/cerrar", datos);
    return response.data;
  }

  async registrarGasto(datos: any) {
    const response = await this.api.post("/gastos", datos);
    return response.data;
  }

  async obtenerReporteCaja(fecha: string) {
    const response = await this.api.get(`/reportes/caja/${fecha}`);
    return response.data;
  }

  // AUDIT ENDPOINTS
  async obtenerAuditLog(filtros?: any) {
    const response = await this.api.get("/audit/log", { params: filtros });
    return response.data;
  }
}

export const apiClient = new ApiClient();

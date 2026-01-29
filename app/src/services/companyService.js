import axios from 'axios'

const API = '/api-worker/'

// CREATE
export const createCompany = async (company) => {
  const { data } = await axios.post(API + 'company', {
      "ruc": company.ruc,
      "razonsocial": company.razonsocial,
      "nombre_comercial": company.nombre_comercial,
      "actividad_economica": company.actividad_economica,
      "representante_legal": company.representante_legal,
      "tipo_empresa": company.tipo_empresa
  })

  return normalizeCompany(data)
}

// UPDATE
export const updateCompany = async (id, company) => {
  const { data } = await axios.put(`${API}company?id=${id}`, {
    "ruc": company.ruc,
    "razonsocial": company.razonsocial,
    "nombre_comercial": company.nombre_comercial,
    "actividad_economica": company.actividad_economica,
    "representante_legal": company.representante_legal,
    "tipo_empresa": company.tipo_empresa
  })

  return normalizeCompany(data)
}

const normalizeCompany = (item) => {
  const parsed = typeof item.data === 'string'
    ? JSON.parse(item.data)
    : item.data

  return {
    id: item.id,
    created_at: item.created_at,
    updated_at: item.updated_at,
    ...parsed
  }
}

export const fetchCompanies = async () => {
  const res = await axios.get(API + 'company')

  if (res.status !== 200 || !Array.isArray(res.data?.data)) {
    return []
  }

  return res.data.data.map(item => {
    let parsed = {}

    return {
      id: item.id,

      // datos reales de empresa
      ruc: item.ruc ?? '',
      razonsocial: item.razonsocial ?? '',
      nombre_comercial: item.nombre_comercial ?? '',
      actividad_economica: item.actividad_economica ?? '',
      representante_legal: item.representante_legal ?? '',
      tipo_empresa: item.tipo_empresa ?? '',

      active: item.active ? 1 : 0,

      // guardamos todo por si luego se edita
      raw: parsed
    }
  })
}

export const deleteCompany = async (id) => {
  return axios.delete(`${API}company?id=${id}`)
}
//ACTIVE INACTIVE
// UPDATE
export const toggleCompany = async (id, company) => {
  const { data } = await axios.patch(`${API}company/active?id=${id}&active=${company.active}`, {
    data: company,
  })

  return normalizeCompany(data)
}

//DASHBOARD
export const fetchDashboard = async () => {
  const res = await axios.get(`${API}dashboard`)
  
  if (res.status !== 200) return []

  return {
    activeCompanies: res.data.companias_activas,
    totalAgents: res.data.canales_conectados,
    messagesTotal: res.data.ultima_interaccion,
    uptime: res.data.conversaciones_atendidas
  }
}

export const fetchCompanyById = async (id) => {
  const res = await axios.get(`${API}company?id=${id}`)
  if(res.status !== 200) return null
  const data = res.data.data

  return {
    id: data.id,
    ...data,
    active: data.active
  }
}

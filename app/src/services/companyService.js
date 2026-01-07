import axios from 'axios'

const API = '/api-worker/'

// CREATE
export const createCompany = async (company) => {
  const { data } = await axios.post(API + 'configs', {
    data: company,
    active: company.active
  })

  return normalizeCompany(data)
}

// UPDATE
export const updateCompany = async (id, company) => {
  const { data } = await axios.put(`${API}configs?id=${id}`, {
    data: company,
    active: company.active
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
  const res = await axios.get(API + 'configs')

  if (res.status !== 200) return []

  return res.data.results.map(item => {
    const parsed = JSON.parse(item.data)

    return {
      id: item.id,
      created_at: item.created_at,
      updated_at: item.updated_at,

      // datos reales de empresa
      name: parsed.name,
      domain: parsed.domain,
      active: item.active ? 1 : 0,
      database: parsed.database,

      raw: parsed
    }
  })
}

export const deleteCompany = async (id) => {
  return axios.delete(`/configs/${API}?id=${id}`)
}
//ACTIVE INACTIVE
// UPDATE
export const toggleCompany = async (id, company) => {
  const { data } = await axios.put(`/configs/${API}?id=${id}&active=${company.active}`, {
    data: company,
  })

  return normalizeCompany(data)
}

//DASHBOARD
export const fetchDashboard = async () => {
  const res = await axios.get(`${API}/dashboard`)
  
  if (res.status !== 200) return []
  console.log(res.data)

  return {
    activeCompanies: res.data.companias_activas,
    totalAgents: res.data.canales_conectados,
    messagesTotal: res.data.ultima_interaccion,
    uptime: res.data.conversaciones_atendidas
  }
}
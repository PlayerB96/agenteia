import axios from 'axios'

const API = '/api-worker/configs'

// CREATE
export const createCompany = async (company) => {
  const { data } = await axios.post(API, {
    data: company
  })

  return normalizeCompany(data)
}

// UPDATE
export const updateCompany = async (id, company) => {
  const { data } = await axios.put(`${API}?id=${id}`, {
    data: company
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
  const res = await axios.get(API)

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
      active: parsed.active,
      database: parsed.database,

      // por si luego lo necesitas completo
      raw: parsed
    }
  })
}

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081/api/atm',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('atm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If 401, clear token and reload
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('atm_token')
      localStorage.removeItem('atm_user')
      window.location.reload()
    }
    return Promise.reject(err)
  }
)

export const atmApi = {
  login: (cardNumber, pin) =>
    api.post('/login', { cardNumber, pin }),

  getBalance: () =>
    api.get('/balance'),

  withdraw: (amount, description = 'ATM Withdrawal') =>
    api.post('/withdraw', { amount, description }),

  deposit: (amount, description = 'Cash Deposit') =>
    api.post('/deposit', { amount, description }),

  getTransactions: (page = 0, size = 10) =>
    api.get(`/transactions?page=${page}&size=${size}`),

  getCards: () =>
    api.get('/cards'),
}

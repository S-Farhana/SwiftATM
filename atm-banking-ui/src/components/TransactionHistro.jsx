import { useState, useEffect } from 'react'
import { atmApi } from '../services/api'
import styles from './TransactionHistory.module.css'

const TYPE_COLORS = {
  WITHDRAWAL:       { color: '#ff3d57', symbol: '↑' },
  DEPOSIT:          { color: '#00e676', symbol: '↓' },
  TRANSFER:         { color: '#ffab00', symbol: '⇄' },
  BALANCE_INQUIRY:  { color: '#4fc3f7', symbol: '◎' },
}

export default function TransactionHistory({ showToast }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [page, setPage]                 = useState(0)
  const [message, setMessage]           = useState('')

  const loadTxns = async (p = 0) => {
    setLoading(true)
    try {
      const res = await atmApi.getTransactions(p, 8)
      setTransactions(res.data.data)
      setMessage(res.data.message)
    } catch {
      showToast('Failed to load transactions', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTxns(0) }, [])

  const handlePage = (newPage) => {
    if (newPage < 0) return
    setPage(newPage)
    loadTxns(newPage)
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>≡ Transaction History</h1>
          <p className={styles.pageSub}>{message}</p>
        </div>
        <button className={`btn btn-outline ${styles.refreshBtn}`} onClick={() => loadTxns(page)}>
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadDots}>
            <span /><span /><span />
          </div>
          <p>Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>≡</div>
          <p>No transactions yet</p>
        </div>
      ) : (
        <div className={styles.list}>
          {transactions.map((txn, i) => {
            const meta = TYPE_COLORS[txn.type] || { color: '#888', symbol: '•' }
            const isCredit = txn.type === 'DEPOSIT'
            return (
              <div key={txn.id} className={styles.row} style={{ animationDelay: `${i * 40}ms` }}>
                <div className={styles.typeIcon} style={{ color: meta.color, borderColor: meta.color + '44' }}>
                  {meta.symbol}
                </div>
                <div className={styles.rowMain}>
                  <div className={styles.rowTitle}>{txn.description}</div>
                  <div className={styles.rowSub}>
                    <span className={styles.ref}>{txn.referenceNumber}</span>
                    <span className={styles.dot}>·</span>
                    <span>{new Date(txn.createdAt).toLocaleString('en-IN', {
                      day:'2-digit', month:'short', year:'numeric',
                      hour:'2-digit', minute:'2-digit'
                    })}</span>
                  </div>
                </div>
                <div className={styles.rowRight}>
                  <div
                    className={styles.amount}
                    style={{ color: isCredit ? 'var(--green)' : 'var(--red)' }}
                  >
                    {isCredit ? '+' : '-'}₹{Number(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={styles.balAfter}>
                    Bal: ₹{Number(txn.balanceAfter).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && transactions.length > 0 && (
        <div className={styles.pagination}>
          <button
            className={`btn btn-outline ${styles.pageBtn}`}
            onClick={() => handlePage(page - 1)}
            disabled={page === 0}
          >
            ← PREV
          </button>
          <span className={styles.pageNum}>Page {page + 1}</span>
          <button
            className={`btn btn-outline ${styles.pageBtn}`}
            onClick={() => handlePage(page + 1)}
            disabled={transactions.length < 8}
          >
            NEXT →
          </button>
        </div>
      )}
    </div>
  )
}

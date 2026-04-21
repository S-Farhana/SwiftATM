import { useState } from 'react'
import styles from './BalanceCard.module.css'

export default function BalanceCard({ balance, user, onRefresh, showToast }) {
  const [loading, setLoading] = useState(false)
  const [refreshed, setRefreshed] = useState(false)

  const handleRefresh = async () => {
    setLoading(true)
    try {
      await onRefresh()
      setRefreshed(true)
      showToast('Balance updated')
      setTimeout(() => setRefreshed(false), 2000)
    } catch {
      showToast('Failed to refresh balance', 'error')
    } finally {
      setLoading(false)
    }
  }

  const formatted = Number(balance).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const [whole, decimal] = formatted.split('.')

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Account Balance</h1>
        <p className={styles.pageSub}>Your current available balance</p>
      </div>

      <div className={styles.balanceCard}>
        <div className={styles.cardTop}>
          <div className={styles.chip}>◈ NEXUSBANK</div>
          <div className={styles.cardType}>SAVINGS ACCOUNT</div>
        </div>

        <div className={styles.balanceBlock}>
          <div className={styles.currency}>₹</div>
          <div className={styles.whole}>{whole}</div>
          <div className={styles.decimal}>.{decimal}</div>
        </div>

        <div className={styles.cardBottom}>
          <div>
            <div className={styles.cardLabel}>CARD HOLDER</div>
            <div className={styles.cardValue}>{user?.accountHolderName}</div>
          </div>
          <div>
            <div className={styles.cardLabel}>CARD NUMBER</div>
            <div className={styles.cardValue} style={{fontFamily:'var(--mono)',letterSpacing:'2px'}}>
              •••• •••• •••• {user?.cardNumber?.slice(-4)}
            </div>
          </div>
        </div>

        <div className={styles.cardGlow} />
      </div>

      <button
        className={`btn btn-outline ${styles.refreshBtn}`}
        onClick={handleRefresh}
        disabled={loading}
      >
        {loading ? '↻  CHECKING...' : refreshed ? '✓  UP TO DATE' : '↻  REFRESH BALANCE'}
      </button>

      <div className={styles.infoGrid}>
        <div className="card">
          <div className="label">Daily Withdrawal Limit</div>
          <div className={styles.infoVal}>₹50,000.00</div>
        </div>
        <div className="card">
          <div className="label">Daily Deposit Limit</div>
          <div className={styles.infoVal}>₹2,00,000.00</div>
        </div>
        <div className="card">
          <div className="label">Account Status</div>
          <div className={styles.statusActive}>● ACTIVE</div>
        </div>
      </div>
    </div>
  )
}

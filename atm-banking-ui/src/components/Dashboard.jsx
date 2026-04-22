import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { atmApi } from '../services/api'
import BalanceCard from './BalanceCard'
import WithdrawForm from './WithdrawForm'
import DepositForm from './DepositForm'
import TransactionHistory from './TransactionHistory'
import CardsView from './CardsView'
import styles from './Dashboard.module.css'

const TABS = [
  { id: 'balance',      label: 'Balance',      icon: '◎' },
  { id: 'withdraw',     label: 'Withdraw',     icon: '↑' },
  { id: 'deposit',      label: 'Deposit',      icon: '↓' },
  { id: 'transactions', label: 'History',      icon: '≡' },
  { id: 'cards',        label: 'Cards',        icon: '▣' },
]

export default function Dashboard() {
  const { user, logout, login } = useAuth()
  const [activeTab, setActiveTab]   = useState('balance')
  const [balance, setBalance]       = useState(user?.balance ?? 0)
  const [toast, setToast]           = useState(null)
  const [time, setTime]             = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const refreshBalance = async () => {
    try {
      const res = await atmApi.getBalance()
      const newBal = res.data.balance
      setBalance(newBal)
      // keep localStorage in sync
      const updated = { ...user, balance: newBal }
      login(updated, localStorage.getItem('atm_token'))
      return newBal
    } catch {}
  }

  const maskedCard = user?.cardNumber
    ? '•••• •••• •••• ' + user.cardNumber.slice(-4)
    : ''

  return (
    <div className={styles.shell}>
      {/* Top bar */}
      <header className={styles.topbar}>
        <div className={styles.topLeft}>
          <span className={styles.logo}>◈ NEXUSBANK</span>
          <span className={styles.separator}>|</span>
          <span className={styles.cardChip}>{maskedCard}</span>
        </div>
        <div className={styles.topRight}>
          <span className={styles.clock} suppressHydrationWarning>
            {time.toLocaleTimeString('en-IN', { hour12: false })}
          </span>
          <button className={`btn btn-outline ${styles.logoutBtn}`} onClick={logout}>
            ⏻ EXIT
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {/* Sidebar nav */}
        <nav className={styles.sidebar}>
          <div className={styles.userBlock}>
            <div className={styles.avatar}>
              {user?.accountHolderName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.accountHolderName}</div>
              <div className={styles.userSub}>Account holder</div>
            </div>
          </div>

          <div className={styles.navItems}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.navActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.navIcon}>{tab.icon}</span>
                <span className={styles.navLabel}>{tab.label}</span>
                {activeTab === tab.id && <span className={styles.navIndicator} />}
              </button>
            ))}
          </div>

          <div className={styles.sidebarBottom}>
            <div className={styles.balanceMini}>
              <div className={styles.balanceMiniLabel}>AVAILABLE BALANCE</div>
              <div className={styles.balanceMiniVal}>
                ₹{Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className={styles.main}>
          {/* Toast notification */}
          {toast && (
            <div className={`${styles.toast} ${styles['toast_' + toast.type]}`}>
              <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
              {toast.msg}
            </div>
          )}

          <div className={styles.content} key={activeTab}>
            {activeTab === 'balance' && (
              <BalanceCard
                balance={balance}
                user={user}
                onRefresh={refreshBalance}
                showToast={showToast}
              />
            )}
            {activeTab === 'withdraw' && (
              <WithdrawForm
                balance={balance}
                onSuccess={(newBal) => { setBalance(newBal); showToast('Withdrawal successful!') }}
                showToast={showToast}
              />
            )}
            {activeTab === 'deposit' && (
              <DepositForm
                onSuccess={(newBal) => { setBalance(newBal); showToast('Deposit successful!') }}
                showToast={showToast}
              />
            )}
            {activeTab === 'transactions' && (
              <TransactionHistory showToast={showToast} />
            )}
            {activeTab === 'cards' && (
              <CardsView showToast={showToast} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

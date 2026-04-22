import { useState } from 'react'
import { atmApi } from '../services/api'
import styles from './TransactionForm.module.css'

// ---- Quick amount buttons ----
const QUICK_AMOUNTS_WITHDRAW = [500, 1000, 2000, 5000, 10000, 20000]
const QUICK_AMOUNTS_DEPOSIT  = [1000, 2000, 5000, 10000, 25000, 50000]

function TransactionFormBase({ type, balance, onSuccess, showToast }) {
  const isWithdraw = type === 'withdraw'
  const [amount, setAmount]       = useState('')
  const [desc, setDesc]           = useState('')
  const [loading, setLoading]     = useState(false)
  const [receipt, setReceipt]     = useState(null)

  const quickAmounts = isWithdraw ? QUICK_AMOUNTS_WITHDRAW : QUICK_AMOUNTS_DEPOSIT

  const handleSubmit = async (e) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { showToast('Enter a valid amount', 'error'); return }
    if (isWithdraw && amt > balance) { showToast('Insufficient balance', 'error'); return }

    setLoading(true)
    try {
      const res = isWithdraw
        ? await atmApi.withdraw(amt, desc || undefined)
        : await atmApi.deposit(amt, desc || undefined)

      const txn = res.data.data
      setReceipt(txn)
      onSuccess(txn.balanceAfter)
      setAmount('')
      setDesc('')
    } catch (err) {
      showToast(err.response?.data?.message || 'Transaction failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (receipt) {
    return (
      <div className={styles.receipt}>
        <div className={styles.receiptIcon}>{isWithdraw ? '↑' : '↓'}</div>
        <div className={styles.receiptTitle}>
          {isWithdraw ? 'Withdrawal Successful' : 'Deposit Successful'}
        </div>
        <div className={styles.receiptAmount}>
          ₹{Number(receipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <div className={styles.receiptRows}>
          <div className={styles.receiptRow}>
            <span>Reference</span>
            <span className={styles.receiptMono}>{receipt.referenceNumber}</span>
          </div>
          <div className={styles.receiptRow}>
            <span>Balance after</span>
            <span className={styles.receiptMono}>
              ₹{Number(receipt.balanceAfter).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className={styles.receiptRow}>
            <span>Status</span>
            <span className={styles.receiptStatus}>✓ {receipt.status}</span>
          </div>
          <div className={styles.receiptRow}>
            <span>Description</span>
            <span>{receipt.description}</span>
          </div>
        </div>
        <button
          className={`btn btn-outline ${styles.anotherBtn}`}
          onClick={() => setReceipt(null)}
        >
          ← NEW TRANSACTION
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {isWithdraw ? '↑ Withdraw Cash' : '↓ Deposit Cash'}
        </h1>
        {isWithdraw && (
          <p className={styles.pageSub}>
            Available: <span className={styles.availBal}>
              ₹{Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        {/* Quick amounts */}
        <div>
          <div className="label">Quick Select</div>
          <div className={styles.quickGrid}>
            {quickAmounts.map(q => (
              <button
                key={q}
                type="button"
                className={`${styles.quickBtn} ${amount === String(q) ? styles.quickActive : ''}`}
                onClick={() => setAmount(String(q))}
              >
                ₹{q.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div className={styles.field}>
          <div className="label">Amount (₹)</div>
          <div className={styles.amountWrap}>
            <span className={styles.rupee}>₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="1"
              max={isWithdraw ? '50000' : '200000'}
              step="0.01"
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>

        {/* Description */}
        <div className={styles.field}>
          <div className="label">Description (optional)</div>
          <input
            type="text"
            placeholder={isWithdraw ? 'ATM Withdrawal' : 'Cash Deposit'}
            value={desc}
            onChange={e => setDesc(e.target.value)}
            maxLength={100}
          />
        </div>

        <button
          type="submit"
          className={`btn btn-green ${styles.submitBtn}`}
          disabled={loading || !amount}
        >
          {loading
            ? 'PROCESSING...'
            : isWithdraw
              ? `↑  WITHDRAW ₹${amount ? Number(amount).toLocaleString('en-IN') : '0'}`
              : `↓  DEPOSIT ₹${amount ? Number(amount).toLocaleString('en-IN') : '0'}`
          }
        </button>
      </form>
    </div>
  )
}

export function WithdrawForm({ balance, onSuccess, showToast }) {
  return <TransactionFormBase type="withdraw" balance={balance} onSuccess={onSuccess} showToast={showToast} />
}

export function DepositForm({ onSuccess, showToast }) {
  return <TransactionFormBase type="deposit" balance={0} onSuccess={onSuccess} showToast={showToast} />
}

export default WithdrawForm

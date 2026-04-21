import { useState, useEffect } from 'react'
import { atmApi } from '../api'
import styles from './CardView.module.css'

export default function CardsView({ showToast }) {
  const [cards, setCards]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    atmApi.getCards()
      .then(res => setCards(res.data.data || []))
      .catch(() => showToast('Failed to load cards', 'error'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>▣ My Cards</h1>
        <p className={styles.pageSub}>Cards linked to your account</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading cards...</div>
      ) : cards.length === 0 ? (
        <div className={styles.empty}>No cards found</div>
      ) : (
        <div className={styles.cardGrid}>
          {cards.map((card, i) => (
            <CardChip key={card.id} card={card} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function CardChip({ card, index }) {
  const isCredit = card.cardType === 'CREDIT'
  const isFrozen = card.status === 'FROZEN' || card.status === 'BLOCKED'

  return (
    <div
      className={`${styles.chip} ${isCredit ? styles.credit : styles.debit} ${isFrozen ? styles.frozen : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={styles.chipTop}>
        <div className={styles.chipLogo}>◈ NEXUSBANK</div>
        <div className={styles.chipTypeBadge}>{card.cardType}</div>
      </div>

      <div className={styles.chipEmv}>▬▬▬</div>

      <div className={styles.chipNumber}>{card.cardNumber}</div>

      <div className={styles.chipBottom}>
        <div>
          <div className={styles.chipLabel}>EXPIRES</div>
          <div className={styles.chipVal}>{card.expiryDate}</div>
        </div>
        <div>
          <div className={styles.chipLabel}>STATUS</div>
          <div className={`${styles.chipVal} ${isFrozen ? styles.frozenText : styles.activeText}`}>
            {isFrozen ? '● FROZEN' : '● ACTIVE'}
          </div>
        </div>
        <div>
          <div className={styles.chipLabel}>DAILY LIMIT</div>
          <div className={styles.chipVal}>
            ₹{Number(card.dailyLimit).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {isCredit && card.creditLimit && (
        <div className={styles.creditInfo}>
          <div className={styles.creditRow}>
            <span>Credit limit</span>
            <span>₹{Number(card.creditLimit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.creditRow}>
            <span>Outstanding</span>
            <span className={styles.outstanding}>
              ₹{Number(card.outstandingBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className={styles.limitBar}>
            <div
              className={styles.limitFill}
              style={{
                width: `${Math.min(100, (card.outstandingBalance / card.creditLimit) * 100)}%`
              }}
            />
          </div>
          <div className={styles.limitLabel}>
            {Math.round((card.outstandingBalance / card.creditLimit) * 100)}% utilised
          </div>
        </div>
      )}
    </div>
  )
}

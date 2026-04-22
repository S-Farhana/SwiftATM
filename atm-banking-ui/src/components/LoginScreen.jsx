import { useState } from 'react'
import { atmApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import styles from './LoginScreen.module.css'

export default function LoginScreen() {
  const { login } = useAuth()
  const [cardNumber, setCardNumber] = useState('')
  const [pin, setPin]               = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  const formatCard = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const handleCardChange = (e) => {
    const formatted = formatCard(e.target.value)
    setCardNumber(formatted)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const rawCard = cardNumber.replace(/\s/g, '')
    if (rawCard.length !== 16) { setError('Enter a valid 16-digit card number'); return }
    if (pin.length < 4)        { setError('PIN must be at least 4 digits'); return }

    setLoading(true)
    try {
      const res = await atmApi.login(rawCard, pin)
      const data = res.data
      login({
        cardNumber: data.cardNumber,
        accountHolderName: data.accountHolderName,
        balance: data.balance,
      }, data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid card number or PIN')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.screen}>
      {/* Left — branding */}
      <div className={styles.branding}>
        <div className={styles.brandInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>NEXUS<span className={styles.logoBold}>BANK</span></span>
          </div>
          <p className={styles.tagline}>Secure. Instant.<br />Always available.</p>
          <div className={styles.features}>
            {['24 / 7 Access', 'Zero Queue', 'Instant Transfers', 'Real-time Alerts'].map(f => (
              <div key={f} className={styles.feature}>
                <span className={styles.featureDot} />
                {f}
              </div>
            ))}
          </div>
          <div className={styles.testCreds}>
            <div className={styles.credLabel}>TEST CREDENTIALS</div>
            <div className={styles.cred}>
              <span className={styles.credKey}>CARD</span>
              <span className={styles.credVal} onClick={() => setCardNumber('1234 5678 9012 3456')}>
                1234 5678 9012 3456
              </span>
            </div>
            <div className={styles.cred}>
              <span className={styles.credKey}>PIN</span>
              <span className={styles.credVal} onClick={() => setPin('1234')}>1234</span>
            </div>
            <div className={styles.credHint}>Click to autofill ↑</div>
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <div className={styles.formHeader}>
            <div className={styles.statusDot} />
            <span className={styles.statusText}>TERMINAL ACTIVE</span>
          </div>
          <h2 className={styles.formTitle}>Insert Card</h2>
          <p className={styles.formSub}>Enter your card details to access your account</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <div className="label">Card Number</div>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardChange}
                maxLength={19}
                inputMode="numeric"
                autoComplete="cc-number"
              />
            </div>

            <div className={styles.field}>
              <div className="label">PIN</div>
              <input
                type="password"
                placeholder="••••"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                inputMode="numeric"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className={styles.error}>
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" className={`btn btn-green ${styles.submitBtn}`} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner} /> VERIFYING...
                </>
              ) : (
                '→  ACCESS ACCOUNT'
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <span className={styles.footerDot}>●</span>
            <span className={styles.footerDot} style={{opacity:0.4}}>●</span>
            <span className={styles.footerDot} style={{opacity:0.2}}>●</span>
            <span className={styles.footerText}>SECURED BY 256-BIT ENCRYPTION</span>
          </div>
        </div>
      </div>
    </div>
  )
}

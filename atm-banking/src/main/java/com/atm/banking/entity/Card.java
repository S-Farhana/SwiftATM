package com.atm.banking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 16)
    private String cardNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardType cardType; // DEBIT or CREDIT

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardStatus status;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal dailyLimit;

    @Column(precision = 15, scale = 2)
    private BigDecimal creditLimit; // Only for CREDIT cards

    @Column(precision = 15, scale = 2)
    private BigDecimal outstandingBalance; // Only for CREDIT cards

    @Column(nullable = false)
    private LocalDate expiryDate;

    @Column(nullable = false, length = 3)
    private String cvv; // In real apps, never store plain CVV

    @Column(nullable = false, updatable = false)
    private LocalDateTime issuedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @PrePersist
    protected void onCreate() {
        issuedAt = LocalDateTime.now();
    }

    public enum CardType {
        DEBIT, CREDIT
    }

    public enum CardStatus {
        ACTIVE, FROZEN, EXPIRED, BLOCKED
    }
}

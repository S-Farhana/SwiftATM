package com.atm.banking.config;

import com.atm.banking.entity.*;
import com.atm.banking.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final CardRepository cardRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAccounts();
        log.info("========================================");
        log.info("  ATM BANKING SYSTEM - TEST ACCOUNTS   ");
        log.info("========================================");
        log.info("  DEBIT CARD: 1234567890123456  PIN: 1234");
        log.info("  CREDIT CARD: 9876543210987654 PIN: 5678");
        log.info("  H2 Console: http://localhost:8080/h2-console");
        log.info("  JDBC URL:   jdbc:h2:mem:atmdb");
        log.info("========================================");
    }

    private void seedAccounts() {
        // ---- Account 1 - Debit card user ----
        if (!accountRepository.existsByCardNumber("1234567890123456")) {
            Account acc1 = Account.builder()
                    .cardNumber("1234567890123456")
                    .pin(passwordEncoder.encode("1234"))
                    .balance(new BigDecimal("25000.00"))
                    .accountHolderName("Arjun Kumar")
                    .email("arjun@example.com")
                    .status(Account.AccountStatus.ACTIVE)
                    .build();
            acc1 = accountRepository.save(acc1);

            Card debitCard = Card.builder()
                    .cardNumber("1234567890123456")
                    .cardType(Card.CardType.DEBIT)
                    .status(Card.CardStatus.ACTIVE)
                    .dailyLimit(new BigDecimal("50000.00"))
                    .expiryDate(LocalDate.now().plusYears(4))
                    .cvv("123")
                    .account(acc1)
                    .build();
            cardRepository.save(debitCard);
        }

        // ---- Account 2 - Credit card user ----
        if (!accountRepository.existsByCardNumber("9876543210987654")) {
            Account acc2 = Account.builder()
                    .cardNumber("9876543210987654")
                    .pin(passwordEncoder.encode("5678"))
                    .balance(new BigDecimal("8500.00"))
                    .accountHolderName("Priya Sharma")
                    .email("priya@example.com")
                    .status(Account.AccountStatus.ACTIVE)
                    .build();
            acc2 = accountRepository.save(acc2);

            Card creditCard = Card.builder()
                    .cardNumber("9876543210987654")
                    .cardType(Card.CardType.CREDIT)
                    .status(Card.CardStatus.ACTIVE)
                    .dailyLimit(new BigDecimal("100000.00"))
                    .creditLimit(new BigDecimal("150000.00"))
                    .outstandingBalance(new BigDecimal("12500.00"))
                    .expiryDate(LocalDate.now().plusYears(3))
                    .cvv("456")
                    .account(acc2)
                    .build();
            cardRepository.save(creditCard);
        }
    }
}

package com.atm.banking.service;

import com.atm.banking.dto.Dtos;
import com.atm.banking.entity.*;
import com.atm.banking.repository.*;
import com.atm.banking.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AtmService {

    private final AccountRepository accountRepository;
    private final CardRepository cardRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // ============================================================
    // 1. LOGIN — card number + PIN → JWT token
    // ============================================================
    public Dtos.LoginRes login(String cardNumber, String pin) {
        Account account = accountRepository.findByCardNumber(cardNumber)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (account.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is " + account.getStatus().name().toLowerCase());
        }

        if (!passwordEncoder.matches(pin, account.getPin())) {
            throw new RuntimeException("Invalid PIN");
        }

        String token = jwtUtil.generateToken(cardNumber, account.getId());
        return new Dtos.LoginRes(token, cardNumber, account.getAccountHolderName(), account.getBalance());
    }

    // ============================================================
    // 2. BALANCE — get current balance
    // ============================================================
    public Dtos.BalanceRes getBalance(Long accountId) {
        Account account = getAccount(accountId);

        // Log balance inquiry as a transaction
        saveTransaction(account, Transaction.TransactionType.BALANCE_INQUIRY,
                BigDecimal.ZERO, account.getBalance(), "Balance enquiry", Transaction.TransactionStatus.SUCCESS);

        return new Dtos.BalanceRes(account.getCardNumber(), account.getAccountHolderName(), account.getBalance());
    }

    // ============================================================
    // 3. WITHDRAW — debit from account
    // ============================================================
    @Transactional
    public Dtos.Api<Dtos.TxnRes> withdraw(Long accountId, BigDecimal amount, String description) {
        Account account = getAccount(accountId);

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance. Available: ₹" + account.getBalance());
        }

        // Check daily withdrawal limit (₹50,000 default)
        BigDecimal dailyLimit = new BigDecimal("50000.00");
        if (amount.compareTo(dailyLimit) > 0) {
            throw new RuntimeException("Amount exceeds daily withdrawal limit of ₹" + dailyLimit);
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        Transaction txn = saveTransaction(account, Transaction.TransactionType.WITHDRAWAL,
                amount, account.getBalance(),
                description != null ? description : "ATM Withdrawal",
                Transaction.TransactionStatus.SUCCESS);

        return Dtos.Api.ok("Withdrawal successful", new Dtos.TxnRes(txn));
    }

    // ============================================================
    // 4. DEPOSIT — credit to account
    // ============================================================
    @Transactional
    public Dtos.Api<Dtos.TxnRes> deposit(Long accountId, BigDecimal amount, String description) {
        Account account = getAccount(accountId);

        BigDecimal maxDeposit = new BigDecimal("200000.00");
        if (amount.compareTo(maxDeposit) > 0) {
            throw new RuntimeException("Amount exceeds maximum deposit limit of ₹" + maxDeposit);
        }

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        Transaction txn = saveTransaction(account, Transaction.TransactionType.DEPOSIT,
                amount, account.getBalance(),
                description != null ? description : "ATM Deposit",
                Transaction.TransactionStatus.SUCCESS);

        return Dtos.Api.ok("Deposit successful", new Dtos.TxnRes(txn));
    }

    // ============================================================
    // 5. TRANSACTION HISTORY — paginated list
    // ============================================================
    public Dtos.Api<List<Dtos.TxnRes>> getTransactions(Long accountId, int page, int size) {
        getAccount(accountId); // validates account exists

        Page<Transaction> txnPage = transactionRepository
                .findByAccountIdOrderByCreatedAtDesc(accountId, PageRequest.of(page, size));

        List<Dtos.TxnRes> results = txnPage.getContent()
                .stream()
                .map(Dtos.TxnRes::new)
                .collect(Collectors.toList());

        return Dtos.Api.ok("Transactions fetched. Page " + (page + 1) + " of " + txnPage.getTotalPages(), results);
    }

    // ============================================================
    // CARDS — get all cards for account
    // ============================================================
    public Dtos.Api<List<Dtos.CardRes>> getCards(Long accountId) {
        getAccount(accountId);
        List<Dtos.CardRes> cards = cardRepository.findByAccountId(accountId)
                .stream()
                .map(Dtos.CardRes::new)
                .collect(Collectors.toList());
        return Dtos.Api.ok("Cards fetched", cards);
    }

    // ============================================================
    // HELPERS
    // ============================================================
    private Account getAccount(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    private Transaction saveTransaction(Account account, Transaction.TransactionType type,
                                        BigDecimal amount, BigDecimal balanceAfter,
                                        String description, Transaction.TransactionStatus status) {
        Transaction txn = Transaction.builder()
                .referenceNumber("TXN" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase())
                .type(type)
                .amount(amount)
                .balanceAfter(balanceAfter)
                .description(description)
                .status(status)
                .account(account)
                .build();
        return transactionRepository.save(txn);
    }
}

package com.atm.banking.dto;

import com.atm.banking.entity.Card;
import com.atm.banking.entity.Transaction;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// ============================================================
// REQUEST DTOs
// ============================================================

class LoginRequest {
    @NotBlank(message = "Card number is required")
    @Size(min = 16, max = 16, message = "Card number must be 16 digits")
    public String cardNumber;

    @NotBlank(message = "PIN is required")
    @Size(min = 4, max = 6, message = "PIN must be 4-6 digits")
    public String pin;
}

class AmountRequest {
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Minimum amount is 1.00")
    @DecimalMax(value = "50000.00", message = "Maximum amount is 50000.00")
    public BigDecimal amount;

    public String description;
}

// ============================================================
// RESPONSE DTOs
// ============================================================

class LoginResponse {
    public String token;
    public String cardNumber;
    public String accountHolderName;
    public BigDecimal balance;
    public String message;

    public LoginResponse(String token, String cardNumber, String name, BigDecimal balance) {
        this.token = token;
        this.cardNumber = cardNumber;
        this.accountHolderName = name;
        this.balance = balance;
        this.message = "Login successful";
    }
}

class BalanceResponse {
    public String cardNumber;
    public String accountHolderName;
    public BigDecimal balance;
    public LocalDateTime checkedAt;

    public BalanceResponse(String cardNumber, String name, BigDecimal balance) {
        this.cardNumber = cardNumber;
        this.accountHolderName = name;
        this.balance = balance;
        this.checkedAt = LocalDateTime.now();
    }
}

class TransactionResponse {
    public Long id;
    public String referenceNumber;
    public String type;
    public BigDecimal amount;
    public BigDecimal balanceAfter;
    public String description;
    public String status;
    public LocalDateTime createdAt;

    public TransactionResponse(Transaction t) {
        this.id = t.getId();
        this.referenceNumber = t.getReferenceNumber();
        this.type = t.getType().name();
        this.amount = t.getAmount();
        this.balanceAfter = t.getBalanceAfter();
        this.description = t.getDescription();
        this.status = t.getStatus().name();
        this.createdAt = t.getCreatedAt();
    }
}

class CardResponse {
    public Long id;
    public String cardNumber;
    public String cardType;
    public String status;
    public BigDecimal dailyLimit;
    public BigDecimal creditLimit;
    public BigDecimal outstandingBalance;
    public LocalDate expiryDate;
    public LocalDateTime issuedAt;

    public CardResponse(Card c) {
        this.id = c.getId();
        this.cardNumber = maskCardNumber(c.getCardNumber());
        this.cardType = c.getCardType().name();
        this.status = c.getStatus().name();
        this.dailyLimit = c.getDailyLimit();
        this.creditLimit = c.getCreditLimit();
        this.outstandingBalance = c.getOutstandingBalance();
        this.expiryDate = c.getExpiryDate();
        this.issuedAt = c.getIssuedAt();
    }

    private String maskCardNumber(String number) {
        return "****-****-****-" + number.substring(12);
    }
}

class ApiResponse<T> {
    public boolean success;
    public String message;
    public T data;

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}

// ============================================================
// PUBLIC EXPORTS  — all classes above are package-private;
// expose them via these public aliases so other packages can use them.
// ============================================================
public class Dtos {
    public static class LoginReq extends LoginRequest {}
    public static class AmountReq extends AmountRequest {}
    public static class LoginRes extends LoginResponse {
        public LoginRes(String token, String cardNumber, String name, BigDecimal balance) {
            super(token, cardNumber, name, balance);
        }
    }
    public static class BalanceRes extends BalanceResponse {
        public BalanceRes(String cardNumber, String name, BigDecimal balance) {
            super(cardNumber, name, balance);
        }
    }
    public static class TxnRes extends TransactionResponse {
        public TxnRes(Transaction t) { super(t); }
    }
    public static class CardRes extends CardResponse {
        public CardRes(Card c) { super(c); }
    }
    public static class Api<T> extends ApiResponse<T> {
        public Api(boolean success, String message, T data) { super(success, message, data); }
        public static <T> Api<T> ok(String message, T data) { return new Api<>(true, message, data); }
        public static <T> Api<T> error(String message) { return new Api<>(false, message, null); }
    }
}

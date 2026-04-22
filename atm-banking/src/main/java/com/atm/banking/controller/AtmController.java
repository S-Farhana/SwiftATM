package com.atm.banking.controller;

import com.atm.banking.dto.Dtos;
import com.atm.banking.service.AtmService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/atm")
@RequiredArgsConstructor
public class AtmController {

    private final AtmService atmService;

    // ============================================================
    // POST /api/atm/login
    // Body: { "cardNumber": "1234567890123456", "pin": "1234" }
    // Returns: JWT token + account info
    // ============================================================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String cardNumber = body.get("cardNumber");
            String pin = body.get("pin");

            if (cardNumber == null || pin == null) {
                return ResponseEntity.badRequest()
                        .body(Dtos.Api.error("cardNumber and pin are required"));
            }

            Dtos.LoginRes response = atmService.login(cardNumber, pin);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Dtos.Api.error(e.getMessage()));
        }
    }

    // ============================================================
    // GET /api/atm/balance
    // Header: Authorization: Bearer <token>
    // Returns: current balance
    // ============================================================
    @GetMapping("/balance")
    public ResponseEntity<?> getBalance(Authentication auth) {
        try {
            Long accountId = (Long) auth.getCredentials();
            Dtos.BalanceRes response = atmService.getBalance(accountId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Dtos.Api.error(e.getMessage()));
        }
    }

    // ============================================================
    // POST /api/atm/withdraw
    // Header: Authorization: Bearer <token>
    // Body: { "amount": 500.00, "description": "ATM Withdrawal" }
    // Returns: transaction details
    // ============================================================
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            Long accountId = (Long) auth.getCredentials();
            java.math.BigDecimal amount = new java.math.BigDecimal(body.get("amount").toString());
            String description = (String) body.getOrDefault("description", "ATM Withdrawal");

            Dtos.Api<Dtos.TxnRes> response = atmService.withdraw(accountId, amount, description);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Dtos.Api.error(e.getMessage()));
        }
    }

    // ============================================================
    // POST /api/atm/deposit
    // Header: Authorization: Bearer <token>
    // Body: { "amount": 1000.00, "description": "Cash Deposit" }
    // Returns: transaction details
    // ============================================================
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            Long accountId = (Long) auth.getCredentials();
            java.math.BigDecimal amount = new java.math.BigDecimal(body.get("amount").toString());
            String description = (String) body.getOrDefault("description", "ATM Deposit");

            Dtos.Api<Dtos.TxnRes> response = atmService.deposit(accountId, amount, description);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Dtos.Api.error(e.getMessage()));
        }
    }

    // ============================================================
    // GET /api/atm/transactions?page=0&size=10
    // Header: Authorization: Bearer <token>
    // Returns: paginated transaction history
    // ============================================================
    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        try {
            Long accountId = (Long) auth.getCredentials();
            Dtos.Api<List<Dtos.TxnRes>> response = atmService.getTransactions(accountId, page, size);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Dtos.Api.error(e.getMessage()));
        }
    }

    // ============================================================
    // GET /api/atm/cards
    // Header: Authorization: Bearer <token>
    // Returns: all cards linked to account
    // ============================================================
    @GetMapping("/cards")
    public ResponseEntity<?> getCards(Authentication auth) {
        try {
            Long accountId = (Long) auth.getCredentials();
            return ResponseEntity.ok(atmService.getCards(accountId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Dtos.Api.error(e.getMessage()));
        }
    }
}

package com.atm.banking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String cardNumber;
    
    @Column(nullable = false)
    private String pin;
    
    @Column(nullable = false)
    private String accountHolderName;
    
    @Column(nullable = false)
    private Double balance;
    
    // Constructors
    public Account() {}
    
    public Account(String cardNumber, String pin, String accountHolderName, Double balance) {
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.accountHolderName = accountHolderName;
        this.balance = balance;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
    
    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
    
    public String getAccountHolderName() { return accountHolderName; }
    public void setAccountHolderName(String accountHolderName) { this.accountHolderName = accountHolderName; }
    
    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }
}
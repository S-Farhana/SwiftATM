package com.atm.banking.dto;

public class LoginRequest {
    private String cardNumber;
    private String pin;
    
    // Constructors
    public LoginRequest() {}
    
    public LoginRequest(String cardNumber, String pin) {
        this.cardNumber = cardNumber;
        this.pin = pin;
    }
    
    // Getters and Setters
    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
    
    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}
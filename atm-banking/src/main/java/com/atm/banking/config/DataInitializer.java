package com.atm.banking.config;

import com.atm.banking.model.Account;
import com.atm.banking.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Create test account
        if (accountRepository.findByCardNumber("1234567890123456").isEmpty()) {
            Account testAccount = new Account("1234567890123456", "1234", "John Doe", 5000.0);
            accountRepository.save(testAccount);
            System.out.println("Test account created: Card 1234567890123456, PIN 1234");
        }
    }
}
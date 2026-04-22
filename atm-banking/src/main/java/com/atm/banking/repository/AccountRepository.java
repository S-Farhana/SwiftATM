package com.atm.banking.repository;

import com.atm.banking.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByCardNumber(String cardNumber);
    boolean existsByCardNumber(String cardNumber);
}

package com.atm.banking.repository;

import com.atm.banking.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByAccountIdOrderByCreatedAtDesc(Long accountId, Pageable pageable);
    List<Transaction> findTop10ByAccountIdOrderByCreatedAtDesc(Long accountId);
}

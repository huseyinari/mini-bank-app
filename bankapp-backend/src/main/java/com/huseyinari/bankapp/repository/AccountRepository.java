package com.huseyinari.bankapp.repository;

import com.huseyinari.bankapp.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID>, QuerydslPredicateExecutor<Account> {
    Optional<Account> findByIdAndUser_Id(UUID id, UUID userId);
    Optional<Account> findByNameAndUser_Id(String name, UUID userId);
    Optional<Account> findByNumber(String number);
}

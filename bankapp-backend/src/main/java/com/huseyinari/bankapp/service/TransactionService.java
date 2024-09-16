package com.huseyinari.bankapp.service;

import com.huseyinari.bankapp.domain.Account;
import com.huseyinari.bankapp.domain.QTransaction;
import com.huseyinari.bankapp.domain.Transaction;
import com.huseyinari.bankapp.enums.TransactionStatus;
import com.huseyinari.bankapp.exception.BankApplicationValidationException;
import com.huseyinari.bankapp.repository.TransactionRepository;
import com.huseyinari.bankapp.request.TransferMoneyRequest;
import com.huseyinari.bankapp.response.AccountSearchResponse;
import com.huseyinari.bankapp.response.TransactionHistoryResponse;
import com.huseyinari.bankapp.response.TransferMoneyResponse;
import com.huseyinari.bankapp.security.SecurityUtil;
import com.querydsl.core.BooleanBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Validated
public class TransactionService {
    private final TransactionRepository repository;
    private final AccountService accountService;

    @Transactional
    public synchronized TransferMoneyResponse transferMoney(@Validated TransferMoneyRequest request) {
        Account fromAccount = accountService.findByNumber(request.getFromAccountNumber());
        Account toAccount = accountService.findByNumber(request.getToAccountNumber());
        BigDecimal amount = request.getAmount();

        if (fromAccount.getId().equals(toAccount.getId())) {
            throw new BankApplicationValidationException("Gönderici ve alıcı hesap aynı olamaz.");
        }
        if (!fromAccount.getUser().getId().equals(SecurityUtil.getCurrentUser().getId())) {
            throw new BankApplicationValidationException("Yetkisiz işlem."); // Eğer login olan kullanıcı kendisine ait olmayan bir hesaptan işlem yapmak istiyorsa hata ver
        }
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new BankApplicationValidationException("Hesabınızda yeterli bakiye bulunmamaktadır.");
        }

        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        toAccount.setBalance(toAccount.getBalance().add(amount));

        Transaction newTransaction = new Transaction();
        newTransaction.setFrom(fromAccount);
        newTransaction.setTo(toAccount);
        newTransaction.setAmount(amount);
        newTransaction.setTransactionDate(LocalDateTime.now());
        newTransaction.setStatus(TransactionStatus.SUCCESS);

        repository.save(newTransaction);

        return new TransferMoneyResponse(fromAccount.getNumber(), toAccount.getNumber(), amount);
    }

    @Transactional(readOnly = true)
    public List<TransactionHistoryResponse> getHistory(UUID accountId) {
        Account account = accountService.getAccountByCurrentUser(accountId);

        QTransaction qTransaction = QTransaction.transaction;
        BooleanBuilder where = new BooleanBuilder();
        where.and(qTransaction.from.id.eq(account.getId()).or(qTransaction.to.id.eq(account.getId())));

        Iterable<Transaction> result = repository.findAll(where);

        List<TransactionHistoryResponse> historyResponseList = new ArrayList<>();
        for (Transaction transaction : result) {
            AccountSearchResponse fromAccount = new AccountSearchResponse();
            fromAccount.setId(transaction.getFrom().getId());
            fromAccount.setNumber(transaction.getFrom().getNumber());
            fromAccount.setName(transaction.getFrom().getName());

            AccountSearchResponse toAccount = new AccountSearchResponse();
            toAccount.setId(transaction.getTo().getId());
            toAccount.setNumber(transaction.getTo().getNumber());
            toAccount.setName(transaction.getTo().getName());

            TransactionHistoryResponse historyResponse = new TransactionHistoryResponse();
            historyResponse.setFromAccount(fromAccount);
            historyResponse.setToAccount(toAccount);
            historyResponse.setStatus(transaction.getStatus());
            historyResponse.setAmount(transaction.getAmount());
            historyResponse.setTransactionDate(transaction.getTransactionDate());

            historyResponseList.add(historyResponse);
        }
        return historyResponseList;
    }
}

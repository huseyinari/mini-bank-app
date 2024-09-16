package com.huseyinari.bankapp.service;

import com.huseyinari.bankapp.domain.Account;
import com.huseyinari.bankapp.domain.QAccount;
import com.huseyinari.bankapp.exception.BankApplicationValidationException;
import com.huseyinari.bankapp.exception.EntityNotFoundException;
import com.huseyinari.bankapp.repository.AccountRepository;
import com.huseyinari.bankapp.request.AccountCreateRequest;
import com.huseyinari.bankapp.request.AccountSearchRequest;
import com.huseyinari.bankapp.request.AccountUpdateRequest;
import com.huseyinari.bankapp.response.AccountCreateResponse;
import com.huseyinari.bankapp.response.AccountDetailResponse;
import com.huseyinari.bankapp.response.AccountSearchResponse;
import com.huseyinari.bankapp.response.AccountUpdateResponse;
import com.huseyinari.bankapp.security.JwtUserDetails;
import com.huseyinari.bankapp.security.SecurityUtil;
import com.querydsl.core.BooleanBuilder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Validated
public class AccountService {
    private final AccountRepository repository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public Account findByNumber(String number) {
        return repository.findByNumber(number).orElseThrow(() -> new EntityNotFoundException("Hesap bulunamadı !"));
    }

    @Transactional
    public AccountCreateResponse createAccount(@Valid AccountCreateRequest createRequest) {
        JwtUserDetails currentUser = SecurityUtil.getCurrentUser();

        Optional<Account> currentAccountByName = repository.findByNameAndUser_Id(createRequest.getName(), currentUser.getId());
        if (currentAccountByName.isPresent()) {
            throw new BankApplicationValidationException("Bu isimde bir hesabınız zaten mevcut.");
        }

        Account newAccount = new Account();
        newAccount.setName(createRequest.getName());
        newAccount.setNumber(createNewAccountNumber());
        newAccount.setBalance(new BigDecimal(1000L));
        newAccount.setUser(userService.findById(currentUser.getId()));

        repository.save(newAccount);

        return new AccountCreateResponse(newAccount.getNumber(), newAccount.getName(), newAccount.getBalance());
    }

    @Transactional(readOnly = true)
    public List<AccountSearchResponse> searchAccounts(AccountSearchRequest searchRequest) {
        JwtUserDetails currentUser = SecurityUtil.getCurrentUser();

        QAccount qAccount = QAccount.account;
        BooleanBuilder where = new BooleanBuilder();

        where.and(qAccount.user.id.eq(currentUser.getId()));    // kullanıcı sadece kendi hesaplarını arayabilecek

        if (StringUtils.isNotBlank(searchRequest.getName())) {
            where.and(qAccount.name.likeIgnoreCase("%" + searchRequest.getName() + "%"));
        }
        if (StringUtils.isNotBlank(searchRequest.getNumber())) {
            where.and(qAccount.number.likeIgnoreCase("%" + searchRequest.getNumber() + "%"));
        }

        Iterable<Account> result = repository.findAll(where);

        List<AccountSearchResponse> searchResponseList = new ArrayList<>();
        for(Account account : result) {
            AccountSearchResponse searchResponse = new AccountSearchResponse();
            searchResponse.setId(account.getId());
            searchResponse.setName(account.getName());
            searchResponse.setNumber(account.getNumber());
            searchResponse.setCreatedAt(account.getCreatedAt());

            searchResponseList.add(searchResponse);
        }

        return searchResponseList;
    }

    @Transactional
    public AccountUpdateResponse updateAccount(UUID id, AccountUpdateRequest updateRequest) {
        Account currentAccount = getAccountByCurrentUser(id);
        currentAccount.setName(updateRequest.getName());

        repository.save(currentAccount);

        return new AccountUpdateResponse(currentAccount.getName(), currentAccount.getNumber(), currentAccount.getBalance());
    }

    @Transactional
    public void delete(UUID id) {
        Account account = getAccountByCurrentUser(id);
        // TODO: Hesaba ait hareketler de silinmeli - işlemler geri alınmalı
        repository.delete(account);
    }

    @Transactional(readOnly = true)
    public AccountDetailResponse getAccountDetail(UUID id) {
        Account account = getAccountByCurrentUser(id);

        return AccountDetailResponse.builder()
                .id(account.getId())
                .name(account.getName())
                .number(account.getNumber())
                .balance(account.getBalance())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }

    protected Account getAccountByCurrentUser(UUID id) {
        // Eğer sisteme login olan kullanıcıya ait bu id'de bir hesap varsa getirir.
        JwtUserDetails currentUser = SecurityUtil.getCurrentUser();

        Optional<Account> optional = repository.findByIdAndUser_Id(id, currentUser.getId());
        if (optional.isEmpty()) {
            throw new BankApplicationValidationException("Size ait böyle bir hesap bulunamadı.");
        }

        return optional.get();
    }

    private String createNewAccountNumber() {
        // 15 karakterli ve daha önce oluşturulmamış bir hesap numarası üretilecek
        String[] characters = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"};
        Random random = new Random();
        while(true) {
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < 15; i++) {
                int randomIndex = random.nextInt(characters.length);
                builder.append(characters[randomIndex]);
            }

            String accountNumber = builder.toString();
            Optional<Account> currentAccount = repository.findByNumber(accountNumber);

            if (currentAccount.isEmpty())
                return accountNumber;
        }
    }
}

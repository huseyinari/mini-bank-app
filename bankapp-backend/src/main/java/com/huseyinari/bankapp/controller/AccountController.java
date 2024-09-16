package com.huseyinari.bankapp.controller;

import com.huseyinari.bankapp.request.AccountCreateRequest;
import com.huseyinari.bankapp.request.AccountSearchRequest;
import com.huseyinari.bankapp.request.AccountUpdateRequest;
import com.huseyinari.bankapp.response.AccountCreateResponse;
import com.huseyinari.bankapp.response.AccountDetailResponse;
import com.huseyinari.bankapp.response.AccountSearchResponse;
import com.huseyinari.bankapp.response.AccountUpdateResponse;
import com.huseyinari.bankapp.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService service;

    @PostMapping
    public ResponseEntity<AccountCreateResponse> create(@RequestBody AccountCreateRequest createRequest) {
        AccountCreateResponse createResponse = service.createAccount(createRequest);
        return new ResponseEntity<>(createResponse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AccountSearchResponse>> search(AccountSearchRequest searchRequest) {
        List<AccountSearchResponse> searchResponseList = service.searchAccounts(searchRequest);
        return ResponseEntity.ok(searchResponseList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDetailResponse> getDetail(@PathVariable("id") UUID id) {
        AccountDetailResponse detailResponse = service.getAccountDetail(id);
        return ResponseEntity.ok(detailResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountUpdateResponse> update(@PathVariable("id") UUID id, @RequestBody AccountUpdateRequest updateRequest) {
        AccountUpdateResponse updateResponse = service.updateAccount(id, updateRequest);
        return ResponseEntity.ok(updateResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

}

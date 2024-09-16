package com.huseyinari.bankapp.controller;

import com.huseyinari.bankapp.request.TransferMoneyRequest;
import com.huseyinari.bankapp.response.TransactionHistoryResponse;
import com.huseyinari.bankapp.response.TransferMoneyResponse;
import com.huseyinari.bankapp.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService service;

    @PostMapping("transfer")
    public ResponseEntity<TransferMoneyResponse> transferMoney(@RequestBody TransferMoneyRequest transferMoneyRequest) {
        TransferMoneyResponse transferMoneyResponse = service.transferMoney(transferMoneyRequest);
        return new ResponseEntity<>(transferMoneyResponse, HttpStatus.CREATED);
    }

    @GetMapping("account/{accountId}")
    public ResponseEntity<List<TransactionHistoryResponse>> getHistory(@PathVariable("accountId") UUID accountId) {
        List<TransactionHistoryResponse> historyResponseList = service.getHistory(accountId);
        return ResponseEntity.ok(historyResponseList);
    }
}

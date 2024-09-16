package com.huseyinari.bankapp.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class AccountSearchResponse {
    private UUID id;
    private String name;
    private String number;
    private LocalDateTime createdAt;
}

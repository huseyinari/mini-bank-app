package com.huseyinari.bankapp.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountSearchRequest {
    private String name;
    private String number;
}

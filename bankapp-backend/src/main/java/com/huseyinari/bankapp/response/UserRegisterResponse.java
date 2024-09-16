package com.huseyinari.bankapp.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserRegisterResponse {
    private String username;
    private String email;
}

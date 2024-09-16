package com.huseyinari.bankapp.controller;

import com.huseyinari.bankapp.request.UserLoginRequest;
import com.huseyinari.bankapp.request.UserRegisterRequest;
import com.huseyinari.bankapp.response.UserLoginResponse;
import com.huseyinari.bankapp.response.UserRegisterResponse;
import com.huseyinari.bankapp.service.UserService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @PostMapping("login")
    @ApiResponse(content = { @Content(schema = @Schema(implementation = UserLoginResponse.class), mediaType = "application/json")})
    public ResponseEntity<UserLoginResponse> signIn(@RequestBody UserLoginRequest loginRequest) {
        UserLoginResponse loginResponse = service.signIn(loginRequest);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("register")
    public ResponseEntity<UserRegisterResponse> signUp(@RequestBody UserRegisterRequest registerRequest) {
        UserRegisterResponse registerResponse = service.signUp(registerRequest);
        return new ResponseEntity<>(registerResponse, HttpStatus.CREATED);
    }
}

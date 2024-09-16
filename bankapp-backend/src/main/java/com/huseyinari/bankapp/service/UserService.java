package com.huseyinari.bankapp.service;

import com.huseyinari.bankapp.domain.User;
import com.huseyinari.bankapp.exception.BankApplicationValidationException;
import com.huseyinari.bankapp.exception.EntityNotFoundException;
import com.huseyinari.bankapp.repository.UserRepository;
import com.huseyinari.bankapp.request.UserLoginRequest;
import com.huseyinari.bankapp.request.UserRegisterRequest;
import com.huseyinari.bankapp.response.UserLoginResponse;
import com.huseyinari.bankapp.response.UserRegisterResponse;
import com.huseyinari.bankapp.security.JwtTokenUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Validated
public class UserService {
    private final UserRepository repository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public User findById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Kullanıcı bulunamadı !"));
    }

    @Transactional(readOnly = true)
    public UserLoginResponse signIn(UserLoginRequest loginRequest) {
        final String username = loginRequest.getUsername();
        final String password = loginRequest.getPassword();

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
        authenticationManager.authenticate(authenticationToken);
        // giriş doğrulama işlemi başarıyla gerçekleşti

        String token = jwtTokenUtil.generateToken(username);
        return new UserLoginResponse(token);
    }

    @Transactional
    public UserRegisterResponse signUp(@Valid UserRegisterRequest registerRequest) {
        Optional<User> currentUserByUsername = repository.findByUsername(registerRequest.getUsername());
        if (currentUserByUsername.isPresent()) {
            throw new BankApplicationValidationException("Bu kullanıcı adına sahip bir hesap zaten mevcut.");
        }

        Optional<User> currentUserByEmail = repository.findByEmail(registerRequest.getEmail());
        if (currentUserByEmail.isPresent()) {
            throw new BankApplicationValidationException("Bu mail adresine sahip bir hesap zaten mevcut.");
        }

        User newUser = new User();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setEmail(registerRequest.getEmail());

        repository.save(newUser);

        return UserRegisterResponse.builder()
                .email(newUser.getEmail())
                .username(newUser.getEmail())
                .build();
    }
}

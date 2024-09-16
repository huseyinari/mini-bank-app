package com.huseyinari.bankapp.security;

import com.huseyinari.bankapp.exception.ActiveUserNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {
    public static JwtUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            throw new ActiveUserNotFoundException();
        }

        if (authentication instanceof UsernamePasswordAuthenticationToken) {
            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = (UsernamePasswordAuthenticationToken) authentication;

            return (JwtUserDetails) usernamePasswordAuthenticationToken.getPrincipal();
        }

        throw new ActiveUserNotFoundException();
    }
}

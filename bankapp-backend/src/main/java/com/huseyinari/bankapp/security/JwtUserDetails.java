package com.huseyinari.bankapp.security;

import com.huseyinari.bankapp.domain.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class JwtUserDetails implements UserDetails {
    private final UUID id;
    private final String username;
    private final String password;
    private final List<? extends GrantedAuthority> authorities;

    public JwtUserDetails(UUID id, String username, String password, List<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    public static JwtUserDetails create(User user) {
        List<GrantedAuthority> authorityList = new ArrayList<>();
        return new JwtUserDetails(user.getId(), user.getUsername(), user.getPassword(), authorityList);
    }
}
package com.example.textile.security;

import com.example.textile.model.User;
import com.example.textile.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        User u = userRepo.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("Not found"));
        return new org.springframework.security.core.userdetails.User(u.getUsername(), u.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(u.getRole())));
    }
}

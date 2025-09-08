package com.example.VA.service;

import com.example.VA.entity.User;
import com.example.VA.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public Optional<User> getUserById(Long id) {
    return userRepository.findById(id);
}


    public User saveUser(User user) {
        return userRepository.save(user);
    }
}

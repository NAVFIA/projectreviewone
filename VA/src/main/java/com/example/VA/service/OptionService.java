package com.example.VA.service;

import com.example.VA.entity.Option;
import com.example.VA.entity.Vote;
import com.example.VA.entity.User;
import com.example.VA.repository.OptionRepository;
import com.example.VA.repository.VoteRepository;
import com.example.VA.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OptionService {
     
    private final OptionRepository optionRepository;
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;

    public List<Option> getOptionsByPoll(Long pollId) {
        return optionRepository.findByPollId(pollId);
    }

    public Option createOption(Option option) {
        return optionRepository.save(option);
    }

    public Option voteOption(Long optionId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Option option = optionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option not found"));
        
        if (voteRepository.existsByUserIdAndPollId(user.getId(), option.getPoll().getId())) {
            throw new RuntimeException("User has already voted in this poll");
        }
        
        Vote vote = Vote.builder()
                .user(user)
                .option(option)
                .build();
        voteRepository.save(vote);
        
        option.setVoteCount(option.getVoteCount() + 1);
        return optionRepository.save(option);
    }
}

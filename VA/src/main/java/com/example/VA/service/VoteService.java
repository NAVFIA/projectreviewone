package com.example.VA.service;

import com.example.VA.entity.Option;
import com.example.VA.entity.Poll;
import com.example.VA.entity.User;
import com.example.VA.entity.Vote;
import com.example.VA.repository.OptionRepository;
import com.example.VA.repository.PollRepository;
import com.example.VA.repository.UserRepository;
import com.example.VA.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final OptionRepository optionRepository;
    private final UserRepository userRepository;
    private final PollRepository pollRepository;

    public Vote castVoteByOption(Long userId, Long optionId) {
        // Fetch option first to get poll
        Option option = optionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option not found"));
        
        Long pollId = option.getPoll().getId();
        return castVote(userId, pollId, optionId);
    }

    public Vote castVote(Long userId, Long pollId, Long optionId) {

        // Check if the user already voted in this poll
        boolean alreadyVoted = voteRepository.existsByUserIdAndPollId(userId, pollId);
        if (alreadyVoted) {
            throw new RuntimeException("User has already voted in this poll!");
        }

        // Fetch entities
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        Option option = optionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option not found"));

        // Increment vote count
        option.setVoteCount(option.getVoteCount() + 1);
        optionRepository.save(option);

        // Save vote
        Vote vote = Vote.builder()
                .user(user)
                .option(option)
                .build();

        return voteRepository.save(vote);
    }
}

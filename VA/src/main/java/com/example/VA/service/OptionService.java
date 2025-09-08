package com.example.VA.service;

import com.example.VA.entity.Option;
import com.example.VA.repository.OptionRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OptionService {
     
    @Autowired
    private OptionRepository optionRepository;

    public List<Option> getOptionsByPoll(Long pollId) {
        return optionRepository.findByPollId(pollId);
    }

    public Option createOption(Option option) {
        return optionRepository.save(option);
    }

    public Option voteOption(Long optionId) {
        Option option = optionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option not found"));
        option.setVoteCount(option.getVoteCount() + 1);
        return optionRepository.save(option);
    }
}

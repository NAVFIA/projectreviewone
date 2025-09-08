package com.example.VA.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.VA.entity.Option;
import com.example.VA.service.OptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/options")
@RequiredArgsConstructor
public class OptionController {

    private final OptionService optionService;

    
    @GetMapping("/poll/{pollId}")
    public ResponseEntity<List<Option>> getOptionsByPoll(@PathVariable Long pollId) {
        List<Option> options = optionService.getOptionsByPoll(pollId);
        return ResponseEntity.ok(options);
    }

    
    @PostMapping
    public ResponseEntity<Option> createOption(@RequestBody Option option) {
        Option createdOption = optionService.createOption(option);
        return ResponseEntity.ok(createdOption);
    }

    
    @PostMapping("/{optionId}/vote")
    public ResponseEntity<Option> voteOption(@PathVariable Long optionId) {
        Option votedOption = optionService.voteOption(optionId);
        return ResponseEntity.ok(votedOption);
    }
}

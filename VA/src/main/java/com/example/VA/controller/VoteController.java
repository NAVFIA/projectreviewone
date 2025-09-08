package com.example.VA.controller;

import com.example.VA.entity.Vote;
import com.example.VA.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    /**
     * Cast a vote for a given poll and option by a user.
     *
     * @param userId   ID of the user voting
     * @param pollId   ID of the poll
     * @param optionId ID of the option
     * @return the saved Vote
     */
    @PostMapping("/cast")
    public ResponseEntity<Vote> castVote(
            @RequestParam Long userId,
            @RequestParam Long pollId,
            @RequestParam Long optionId
    ) {
        try {
            Vote vote = voteService.castVote(userId, pollId, optionId);
            return ResponseEntity.ok(vote);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}

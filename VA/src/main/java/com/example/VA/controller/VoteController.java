package com.example.VA.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.VA.entity.Vote;
import com.example.VA.entity.User;
import com.example.VA.service.VoteService;
import com.example.VA.service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
public class VoteController {

    private final VoteService voteService;
    private final UserService userService;

    /**
     * Cast a vote using optionId from request body and authenticated user
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('CREATOR') or hasRole('VOTER')")
    public ResponseEntity<Vote> vote(@RequestBody Map<String, Long> request, Authentication auth) {
        try {
            Long optionId = request.get("optionId");
            User user = userService.findByUsername(auth.getName());
            
            // Get pollId from option
            Vote vote = voteService.castVoteByOption(user.getId(), optionId);
            return ResponseEntity.ok(vote);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Cast a vote for a given poll and option by a user.
     *
     * @param userId   ID of the user voting
     * @param pollId   ID of the poll
     * @param optionId ID of the option
     * @return the saved Vote
     */
    @PostMapping("/cast")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CREATOR') or hasRole('VOTER')")
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

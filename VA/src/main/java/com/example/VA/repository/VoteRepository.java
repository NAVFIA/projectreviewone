package com.example.VA.repository;

import com.example.VA.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByPoll_IdAndVoter_Id(Long pollId, Long voterId);
}

package com.example.VA.repository;

import com.example.VA.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByUserIdAndOptionId(Long userId, Long optionId);
    
    @Query("SELECT COUNT(v) > 0 FROM Vote v WHERE v.user.id = ?1 AND v.option.poll.id = ?2")
    boolean existsByUserIdAndPollId(Long userId, Long pollId);
}
package com.example.VA.repository;

import com.example.VA.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OptionRepository extends JpaRepository<Option, Long> {

    // This method must be declared
   List<Option> findByPollId(Long pollId);
    
}

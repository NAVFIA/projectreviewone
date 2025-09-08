package com.example.VA.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "options")   // ✅ avoid reserved keyword
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    private int voteCount = 0;

    @ManyToOne
    @JoinColumn(name = "poll_id")  // ✅ explicit foreign key column name
    private Poll poll;
}

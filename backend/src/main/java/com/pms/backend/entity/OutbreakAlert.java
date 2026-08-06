package com.pms.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "outbreak_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OutbreakAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String diseaseType;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private Integer caseCount;

    @Column(nullable = false)
    private LocalDate windowStart;

    @Column(nullable = false)
    private LocalDate windowEnd;

    @Column(nullable = false)
    private String status = "OPEN"; // OPEN, RESOLVED

    @Column(nullable = false)
    private LocalDateTime detectedAt = LocalDateTime.now();
}
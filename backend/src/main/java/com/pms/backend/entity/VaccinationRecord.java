package com.pms.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "vaccination_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "worker_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String vaccineName;

    @Column(nullable = false)
    private Integer doseNumber;

    @Column(nullable = false)
    private LocalDate dateGiven;

    @ManyToOne
    @JoinColumn(name = "administered_by")
    private User administeredBy;
}
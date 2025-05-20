package ru.ssu.pharmacy.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Table(name = "medication")
@Getter @Setter @NoArgsConstructor
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicationName;
    private String form;
    private String medicationDescription;

    @ManyToOne
    @JoinColumn(name = "active_substance_id", nullable = false)
    private ActiveSubstance activeSubstance;
}


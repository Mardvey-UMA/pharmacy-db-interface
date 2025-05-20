package ru.ssu.pharmacy.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "active_substance")
@Getter
@Setter
@NoArgsConstructor
public class ActiveSubstance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private Boolean needRecipe;
    private Boolean needRefregerator;
    private String substanceDescription;
}


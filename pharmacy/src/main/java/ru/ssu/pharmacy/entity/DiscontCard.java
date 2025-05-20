package ru.ssu.pharmacy.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "discont_card")
@Getter @Setter @NoArgsConstructor
public class DiscontCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal discount;

    @OneToOne
    @JoinColumn(name = "client_id", nullable = false, unique = true)
    private Client client;
}

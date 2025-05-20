package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import ru.ssu.pharmacy.entity.ClientOrder;

public interface ClientOrderRepository extends JpaRepository<ClientOrder, Long>, JpaSpecificationExecutor<ClientOrder> {
}


package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.ssu.pharmacy.entity.ClientOrder;

import java.util.List;

public interface ClientOrderRepository extends JpaRepository<ClientOrder, Long>, JpaSpecificationExecutor<ClientOrder> {
    @Query("SELECT o FROM ClientOrder o LEFT JOIN FETCH o.medications WHERE o.client.id = :clientId")
    List<ClientOrder> findAllByClientId(@Param("clientId") Long clientId);
    @Query("SELECT o FROM ClientOrder o JOIN o.assemblers a WHERE a.id = :empId")
    List<ClientOrder> findAllByAssemblerId(@Param("empId") Long empId);

    @Query("SELECT o FROM ClientOrder o JOIN o.couriers c WHERE c.id = :empId")
    List<ClientOrder> findAllByCourierId(@Param("empId") Long empId);
}


-- Клиент
CREATE TABLE client(
                       id BIGSERIAL PRIMARY KEY,
                       full_name TEXT
);

-- Дисконтная карта
CREATE TABLE discont_card(
                             id BIGSERIAL PRIMARY KEY,
                             discount DECIMAL(10, 2) CHECK (discount BETWEEN 0 AND 100),
                             client_id BIGINT NOT NULL UNIQUE,
                             FOREIGN KEY (client_id) REFERENCES client(id)
);

-- Аптека
CREATE TABLE pharmacy(
                         id BIGSERIAL PRIMARY KEY,
                         pharmacy_address VARCHAR(255) NOT NULL
);

-- Должность
CREATE TABLE position(
                         id BIGSERIAL PRIMARY KEY,
                         salary DECIMAL(10, 2),
                         position_description TEXT
);

-- Работник
CREATE TABLE employee(
                         id BIGSERIAL PRIMARY KEY,
                         full_name TEXT,
                         passport VARCHAR(20),
                         pharmacy_id BIGINT NOT NULL,
                         position_id BIGINT NOT NULL,
                         FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id),
                         FOREIGN KEY (position_id) REFERENCES position(id)
);

-- Действующее вещество
CREATE TABLE active_substance(
                                 id BIGSERIAL PRIMARY KEY,
                                 category VARCHAR(255),
                                 need_recipe BOOLEAN,
                                 need_refregerator BOOLEAN,
                                 substance_description TEXT
);

-- Лекарство
CREATE TABLE medication(
                           id BIGSERIAL PRIMARY KEY,
                           medication_name TEXT,
                           form VARCHAR(255),
                           medication_description TEXT,
                           active_substance_id BIGINT NOT NULL,
                           FOREIGN KEY (active_substance_id) REFERENCES active_substance(id)
);

-- Поставщик
CREATE TABLE vendor(
                       id BIGSERIAL PRIMARY KEY,
                       vendor_description TEXT,
                       phone_number VARCHAR(20),
                       vendor_certificate VARCHAR(255)
);

-- Поставка
CREATE TABLE supply(
                       id BIGSERIAL PRIMARY KEY,
                       supply_date DATE,
                       supply_time TIME,
                       accepted BOOLEAN,
                       vendor_id BIGINT NOT NULL,
                       FOREIGN KEY (vendor_id) REFERENCES vendor(id)
);

-- Склад
CREATE TABLE storage(
                        id BIGSERIAL PRIMARY KEY,
                        quantity BIGINT,
                        expiration_date DATE,
                        purchase_price DECIMAL(10, 2),
                        supply_id BIGINT NOT NULL,
                        medication_id BIGINT NOT NULL,
                        FOREIGN KEY (supply_id) REFERENCES supply(id),
                        FOREIGN KEY (medication_id) REFERENCES medication(id)
);

-- Продажа
CREATE TABLE sale(
                     id BIGSERIAL PRIMARY KEY,
                     sale_date DATE,
                     sale_time TIME,
                     discont_card_id BIGINT,
                     FOREIGN KEY (discont_card_id) REFERENCES discont_card(id)
);

-- Продажа_лекарство
CREATE TABLE sale_medication(
                                id BIGSERIAL PRIMARY KEY,
                                quantity BIGINT,
                                price DECIMAL(10, 2),
                                sale_id BIGINT NOT NULL,
                                medication_id BIGINT NOT NULL,
                                FOREIGN KEY (sale_id) REFERENCES sale(id),
                                FOREIGN KEY (medication_id) REFERENCES medication(id)
);
-- Заказ
CREATE TABLE client_order(
                             id BIGSERIAL PRIMARY KEY,
                             order_address VARCHAR(255) NOT NULL,
                             order_date DATE,
                             status VARCHAR(20),
                             client_id BIGINT NOT NULL,
                             FOREIGN KEY (client_id) REFERENCES client(id)
);

-- Связь заказ-сборщики (N:M)
CREATE TABLE order_assemblers(
                                 order_id BIGINT NOT NULL,
                                 employee_id BIGINT NOT NULL,
                                 PRIMARY KEY (order_id, employee_id),
                                 FOREIGN KEY (order_id) REFERENCES client_order(id),
                                 FOREIGN KEY (employee_id) REFERENCES employee(id)
);

-- Связь заказ-курьеры (N:M)
CREATE TABLE order_couriers(
                               order_id BIGINT NOT NULL,
                               employee_id BIGINT NOT NULL,
                               PRIMARY KEY (order_id, employee_id),
                               FOREIGN KEY (order_id) REFERENCES client_order(id),
                               FOREIGN KEY (employee_id) REFERENCES employee(id)
);

-- Заказ_лекарство
CREATE TABLE order_medication(
                                 id BIGSERIAL PRIMARY KEY,
                                 quantity BIGINT,
                                 price DECIMAL(10, 2),
                                 order_id BIGINT NOT NULL,
                                 medication_id BIGINT NOT NULL,
                                 FOREIGN KEY (order_id) REFERENCES client_order(id),
                                 FOREIGN KEY (medication_id) REFERENCES medication(id)
);


ALTER TABLE supply ADD COLUMN pharmacy_id BIGINT REFERENCES pharmacy(id);

ALTER TABLE sale ADD COLUMN employee_id BIGINT REFERENCES employee(id);

CREATE TYPE medication_quantity AS (
    medication_id BIGINT,
    quantity BIGINT
    );

-- 1. Функция: Расчет общей стоимости заказа
CREATE OR REPLACE FUNCTION calculate_order_total(order_id BIGINT)
RETURNS DECIMAL(10,2) AS $$
DECLARE
total DECIMAL(10,2) := 0;
   discount DECIMAL(10,2);
   client_id BIGINT;
BEGIN
   -- Суммируем стоимость всех лекарств в заказе
SELECT SUM(om.quantity * om.price) INTO total
FROM order_medication om
WHERE om.order_id = calculate_order_total.order_id;
-- Получаем дисконтную карту клиента
SELECT c.id, COALESCE(dc.discount, 0) INTO client_id, discount
FROM client_order co
         LEFT JOIN discont_card dc ON co.client_id = dc.client_id
         JOIN client c ON co.client_id = c.id
WHERE co.id = order_id;
-- Применяем скидку
total := total * (1 - discount / 100);
RETURN total;
END;
$$ LANGUAGE plpgsql;


-- 2. Функция: Получение информации о сотрудниках с зарплатой
CREATE OR REPLACE FUNCTION get_employees_with_salary(pharmacy_id BIGINT)
RETURNS TABLE (
   -- pharmacy_id BIGINT, -- add
   employee_name TEXT,
   position_description TEXT,
   final_salary DECIMAL(10,2)
) AS $$
BEGIN
RETURN QUERY
SELECT
    e.full_name::TEXT,
        p.position_description::TEXT,
        CASE
            WHEN p.position_description LIKE '%Курьер%' THEN p.salary * 1.15
            WHEN p.position_description LIKE '%Старший%' THEN p.salary * 1.20
            ELSE p.salary
            END AS final_salary
FROM employee e
         JOIN position p ON e.position_id = p.id
WHERE e.pharmacy_id = get_employees_with_salary.pharmacy_id;
END;
$$ LANGUAGE plpgsql;

-- 3. функция get_expiring_medications
CREATE OR REPLACE FUNCTION get_expiring_medications(days_threshold INT)
RETURNS SETOF storage AS $$
BEGIN
RETURN QUERY
SELECT *
FROM storage
WHERE expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + days_threshold;
END;
$$ LANGUAGE plpgsql;

-- 1.1 процедура process_sale
-- CREATE OR REPLACE PROCEDURE process_sale(
--    pharmacy_id BIGINT,
--    employee_id BIGINT,
--    medications medication_quantity[],
--    discount_card_id BIGINT DEFAULT NULL
-- ) AS $$
-- DECLARE
-- sale_id BIGINT;
--    m medication_quantity;
--    med_price DECIMAL(10,2);
--    current_quantity BIGINT;
-- BEGIN
--    -- Начало транзакции
-- BEGIN
--        -- Создаем запись о продаже
-- INSERT INTO sale(sale_date, sale_time, discont_card_id, employee_id)
-- VALUES (CURRENT_DATE, CURRENT_TIME, discount_card_id, employee_id)
--     RETURNING id INTO sale_id;
-- -- Обрабатываем каждое лекарство
-- FOREACH m IN ARRAY medications
--        LOOP
--            -- Проверяем доступное количество
-- SELECT COALESCE(SUM(s.quantity), 0) INTO current_quantity
-- FROM storage s
--          JOIN supply sp ON s.supply_id = sp.id
-- WHERE s.medication_id = m.medication_id
--   AND sp.pharmacy_id = process_sale.pharmacy_id;
-- IF current_quantity < m.quantity THEN
--                RAISE EXCEPTION 'Недостаточно лекарства ID % (нужно %, доступно %)',
--                    m.medication_id, m.quantity, current_quantity;
-- END IF;
--            -- Получаем текущую цену
-- SELECT (s.purchase_price * 1.30) INTO med_price
-- FROM storage s
--          JOIN supply sp ON s.supply_id = sp.id
-- WHERE s.medication_id = m.medication_id
--   AND sp.pharmacy_id = process_sale.pharmacy_id
-- ORDER BY s.expiration_date DESC
--     LIMIT 1;
-- -- Добавляем лекарство в продажу
-- INSERT INTO sale_medication(quantity, price, sale_id, medication_id)
-- VALUES (m.quantity, med_price, sale_id, m.medication_id);
-- -- Уменьшаем остатки на складе
-- UPDATE storage s
-- SET quantity = s.quantity - m.quantity
--     FROM supply sp
-- WHERE s.supply_id = sp.id
--   AND s.medication_id = m.medication_id
--   AND sp.pharmacy_id = process_sale.pharmacy_id;
-- END LOOP;
-- EXCEPTION
--        WHEN OTHERS THEN
--            ROLLBACK;
--            RAISE;
-- END;
-- END;
-- $$ LANGUAGE plpgsql;

-- Изменяем тип параметра medications на text
CREATE OR REPLACE PROCEDURE process_sale(
    pharmacy_id BIGINT,
    employee_id BIGINT,
    medications TEXT,
    discount_card_id BIGINT DEFAULT NULL
) AS $$
DECLARE
    sale_id BIGINT;
    m RECORD;
    med_price DECIMAL(10,2);
    current_quantity BIGINT;
    medications_array medication_quantity[];
BEGIN
    -- Используем правильное преобразование строки в массив
    medications_array = medications::medication_quantity[];

    INSERT INTO sale(sale_date, sale_time, discont_card_id, employee_id)
    VALUES (CURRENT_DATE, CURRENT_TIME, discount_card_id, employee_id)
    RETURNING id INTO sale_id;

    FOREACH m IN ARRAY medications_array
        LOOP
            -- Остальная логика без изменений
            SELECT COALESCE(SUM(s.quantity), 0) INTO current_quantity
            FROM storage s
                     JOIN supply sp ON s.supply_id = sp.id
            WHERE s.medication_id = m.medication_id
              AND sp.pharmacy_id = pharmacy_id;

            IF current_quantity < m.quantity THEN
                RAISE EXCEPTION 'Недостаточно лекарства ID % (нужно %, доступно %)',
                    m.medication_id, m.quantity, current_quantity;
            END IF;

            SELECT (s.purchase_price * 1.30) INTO med_price
            FROM storage s
                     JOIN supply sp ON s.supply_id = sp.id
            WHERE s.medication_id = m.medication_id
              AND sp.pharmacy_id = pharmacy_id
            ORDER BY s.expiration_date DESC
            LIMIT 1;

            INSERT INTO sale_medication(quantity, price, sale_id, medication_id)
            VALUES (m.quantity, med_price, sale_id, m.medication_id);

            UPDATE storage s
            SET quantity = s.quantity - m.quantity
            FROM supply sp
            WHERE s.supply_id = sp.id
              AND s.medication_id = m.medication_id
              AND sp.pharmacy_id = pharmacy_id;
        END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 1.2. процедура update_order_status
CREATE OR REPLACE PROCEDURE update_order_status(
   order_id BIGINT,
   new_status VARCHAR(20),
   courier_id BIGINT DEFAULT NULL
) AS $$
DECLARE
is_courier BOOLEAN;
BEGIN
   IF new_status = 'доставка' THEN
       IF courier_id IS NULL THEN
           RAISE EXCEPTION 'Необходимо указать курьера для статуса доставки';
END IF;
       PERFORM 1
       FROM employee e
       JOIN position p ON e.position_id = p.id
       WHERE e.id = courier_id
         AND p.position_description LIKE '%Курьер%';

       IF NOT FOUND THEN
           RAISE EXCEPTION 'Сотрудник с ID % не является курьером', courier_id;
END IF;
INSERT INTO order_couriers(order_id, employee_id)
VALUES (order_id, courier_id)
    ON CONFLICT DO NOTHING;
END IF;
UPDATE client_order
SET status = new_status
WHERE id = order_id;
END;
$$ LANGUAGE plpgsql;
from decimal import Decimal

import psycopg2
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker('ru_RU')

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    dbname="pharmacy_db",
    user="pharmacy",
    password="pharmacy"
)
cur = conn.cursor()

current_date = datetime(2025, 5, 20).date()


def random_date(start_date=None, end_date=None):
    if start_date is None:
        start_date = current_date - timedelta(days=5 * 365)
    if end_date is None:
        end_date = current_date
    return start_date + timedelta(days=random.randint(0, (end_date - start_date).days))


user_counter = 1
for _ in range(2000):
    full_name = fake.name()
    username = f"user{user_counter}"
    password = f"user{user_counter}"
    user_role = "USER"

    cur.execute(
        """INSERT INTO client
            (full_name, username, password, user_role)
            VALUES (%s, %s, %s, %s)
            RETURNING id""",
        (full_name, username, password, user_role)
    )
    client_id = cur.fetchone()[0]
    user_counter += 1

    # Генерация скидочных карт (оставляем оригинальную логику)
    discount = round(random.uniform(5, 15), 2)
    cur.execute(
        "INSERT INTO discont_card (discount, client_id) VALUES (%s, %s)",
        (discount, client_id)
    )

# Добавляем администратора
admin_full_name = fake.name()
cur.execute(
    """INSERT INTO client
        (full_name, username, password, user_role)
        VALUES (%s, 'admin', 'admin', 'ADMIN')
        RETURNING id""",
    (admin_full_name,)
)
admin_id = cur.fetchone()[0]
print(admin_id)
# conn.commit()
# cur.close()
# conn.close()

pharmacies = []
for _ in range(20):
    address = fake.street_address() + ", " + fake.city()
    cur.execute("INSERT INTO pharmacy (pharmacy_address) VALUES (%s) RETURNING id", (address,))
    pharmacies.append(cur.fetchone()[0])

positions = []
position_names = [
    ("Фармацевт", 45000, "Консультация клиентов, продажа лекарств"),
    ("Провизор", 60000, "Контроль работы аптеки, заказ лекарств"),
    ("Старший фармацевт", 55000, "Обучение новых сотрудников, контроль качества"),
    ("Кассир", 40000, "Прием платежей, работа с кассой"),
    ("Менеджер аптеки", 70000, "Управление персоналом, отчетность"),
    ("Курьер", 35000, "Доставка заказов клиентам"),
    ("Сборщик заказов", 38000, "Комплектация заказов для доставки")
]

for name, salary, desc in position_names:
    cur.execute(
        "INSERT INTO position (salary, position_description) VALUES (%s, %s) RETURNING id",
        (salary, f"{name}. {desc}")
    )
    positions.append(cur.fetchone()[0])

employees = []
for _ in range(300):
    full_name = fake.name()
    passport = f"{random.randint(1000, 9999)} {random.randint(100000, 999999)}"
    pharmacy_id = random.choice(pharmacies)
    position_id = random.choice(positions)

    cur.execute(
        "INSERT INTO employee (full_name, passport, pharmacy_id, position_id) VALUES (%s, %s, %s, %s) RETURNING id",
        (full_name, passport, pharmacy_id, position_id)
    )
    employees.append(cur.fetchone()[0])

substances = []
categories = ["Антибиотики", "Анальгетики", "Антигистаминные", "Гормональные", "Витамины",
              "Противовирусные", "Противовоспалительные", "Антидепрессанты", "Гипотензивные"]

for _ in range(120):
    category = random.choice(categories)
    need_recipe = random.random() < 0.3
    need_refregerator = random.random() < 0.2
    description = fake.sentence()

    cur.execute(
        "INSERT INTO active_substance (category, need_recipe, need_refregerator, substance_description) VALUES (%s, %s, %s, %s) RETURNING id",
        (category, need_recipe, need_refregerator, description)
    )
    substances.append(cur.fetchone()[0])

medications = []
forms = ["Таблетки", "Капсулы", "Сироп", "Мазь", "Гель", "Раствор", "Спрей", "Капли"]

for _ in range(150):
    name = fake.word().capitalize() + " " + random.choice(["форте", "экстра", "плюс", "", "актив", "ультра"])
    form = random.choice(forms)
    description = fake.sentence()
    active_substance_id = random.choice(substances)


    cur.execute(
        "INSERT INTO medication (medication_name, form, medication_description, active_substance_id) VALUES (%s, %s, %s, %s) RETURNING id",
        (name, form, description, active_substance_id)
    )
    medications.append(cur.fetchone()[0])

vendors = []
for _ in range(30):
    description = fake.company()
    phone = fake.phone_number()
    certificate = fake.bothify(text="CERT-####-????-####")

    cur.execute(
        "INSERT INTO vendor (vendor_description, phone_number, vendor_certificate) VALUES (%s, %s, %s) RETURNING id",
        (description, phone, certificate)
    )
    vendors.append(cur.fetchone()[0])

supplies = []
for _ in range(500):
    supply_date = random_date(end_date=current_date)
    supply_time = datetime.strptime(f"{random.randint(8, 20)}:{random.randint(0, 59):02d}", "%H:%M").time()
    accepted = random.random() < 0.9  # 90% поставок приняты
    vendor_id = random.choice(vendors)
    pharmacy_id = random.choice(pharmacies)  # Добавляем случайную аптеку

    cur.execute(
        "INSERT INTO supply (supply_date, supply_time, accepted, vendor_id, pharmacy_id) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (supply_date, supply_time, accepted, vendor_id, pharmacy_id)
    )
    supplies.append(cur.fetchone()[0])

for _ in range(2000):
    quantity = random.randint(10, 500)
    expiration_date = random_date(start_date=current_date, end_date=current_date + timedelta(days=3 * 365))
    purchase_price = Decimal(str(round(random.uniform(50, 5000), 2)))
    supply_id = random.choice(supplies)
    medication_id = random.choice(medications)

    cur.execute(
        "INSERT INTO storage (quantity, expiration_date, purchase_price, supply_id, medication_id) VALUES (%s, %s, %s, %s, %s)",
        (quantity, expiration_date, purchase_price, supply_id, medication_id)
    )

sales = []
for _ in range(3000):
    sale_date = random_date(end_date=current_date)
    sale_time = datetime.strptime(f"{random.randint(8, 20)}:{random.randint(0, 59):02d}", "%H:%M").time()

    pharmacy_id = random.choice(pharmacies)
    cur.execute("SELECT id FROM employee WHERE pharmacy_id = %s ORDER BY random() LIMIT 1", (pharmacy_id,))
    employee_row = cur.fetchone()
    if not employee_row:
        continue
    employee_id = employee_row[0]

    cur.execute("SELECT id FROM discont_card ORDER BY random() LIMIT 1")
    discount_card_row = cur.fetchone()
    discount_card_id = discount_card_row[0]

    cur.execute(
        "INSERT INTO sale (sale_date, sale_time, discont_card_id, employee_id) VALUES (%s, %s, %s, %s) RETURNING id",
        (sale_date, sale_time, discount_card_id, employee_id)
    )
    sale_id = cur.fetchone()[0]
    sales.append(sale_id)

    num_medications = random.randint(1, 5)
    for _ in range(num_medications):
        cur.execute("SELECT id FROM medication ORDER BY random() LIMIT 1")
        med_row = cur.fetchone()
        if not med_row:
            continue
        medication_id = med_row[0]
        quantity = random.randint(1, 5)

        cur.execute(
            "SELECT purchase_price FROM storage WHERE medication_id = %s ORDER BY random() LIMIT 1",
            (medication_id,)
        )
        price_row = cur.fetchone()
        if not price_row:
            continue
        purchase_price = price_row[0]

        markup = Decimal(str(1 + random.uniform(0.2, 1.0)))
        price = (purchase_price * markup).quantize(Decimal('0.01'))

        cur.execute(
            "INSERT INTO sale_medication (quantity, price, sale_id, medication_id) VALUES (%s, %s, %s, %s)",
            (quantity, price, sale_id, medication_id)
        )


orders = []
for _ in range(1500):
    order_address = fake.street_address() + ", " + fake.city()
    order_date = random_date(end_date=current_date)
    status = random.choice(["обработка", "сборка", "доставка", "выполнен", "отменен"])

    cur.execute("SELECT id FROM client ORDER BY random() LIMIT 1")
    client_id = cur.fetchone()[0]

    cur.execute(
        "INSERT INTO client_order (order_address, order_date, status, client_id) VALUES (%s, %s, %s, %s) RETURNING id",
        (order_address, order_date, status, client_id)
    )
    order_id = cur.fetchone()[0]
    orders.append(order_id)

    for _ in range(random.randint(1, 5)):
        cur.execute("SELECT id FROM medication ORDER BY random() LIMIT 1")
        medication_id = cur.fetchone()[0]
        quantity = random.randint(1, 5)

        cur.execute(
            "SELECT purchase_price FROM storage WHERE medication_id = %s ORDER BY random() LIMIT 1",
            (medication_id,)
        )
        purchase_price = cur.fetchone()[0]
        price = Decimal(str(round(purchase_price * Decimal(str((1 + random.uniform(0.2, 1.0)))), 2)))

        cur.execute(
            "INSERT INTO order_medication (quantity, price, order_id, medication_id) VALUES (%s, %s, %s, %s)",
            (quantity, price, order_id, medication_id)
        )

    limit = random.randint(1, 3)
    cur.execute(
        f"SELECT id FROM employee WHERE position_id IN (SELECT id FROM position WHERE position_description LIKE '%Сборщик%' OR position_description LIKE '%Фармацевт%') ORDER BY random() LIMIT {limit}"
    )
    for assembler in cur.fetchall():
        cur.execute(
            "INSERT INTO order_assemblers (order_id, employee_id) VALUES (%s, %s)",
            (order_id, assembler[0])
        )

    if status not in ["отменен", "обработка"]:
        limit = 1
        cur.execute(
            f"SELECT id FROM employee WHERE position_id IN (SELECT id FROM position WHERE position_description LIKE '%Курьер%') ORDER BY random() LIMIT {limit}"
        )
        courier = cur.fetchone()
        if courier:
            cur.execute(
                "INSERT INTO order_couriers (order_id, employee_id) VALUES (%s, %s)",
                (order_id, courier[0])
            )

conn.commit()
cur.close()
conn.close()

print("База данных успешно заполнена тестовыми данными.")

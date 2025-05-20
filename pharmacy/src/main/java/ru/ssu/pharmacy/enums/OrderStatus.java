package ru.ssu.pharmacy.enums;

public enum OrderStatus {
    НОВЫЙ("Новый"),
    В_РАБОТЕ("В работе"),
    ДОСТАВКА("Доставка"),
    ЗАВЕРШЕН("Завершен"),
    ОТМЕНЕН("Отменен");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

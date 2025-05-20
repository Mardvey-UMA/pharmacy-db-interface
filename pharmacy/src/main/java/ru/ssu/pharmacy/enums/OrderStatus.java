package ru.ssu.pharmacy.enums;

public enum OrderStatus {
    сборка("сборка"),
    обработка("обработка"),
    доставка("доставка"),
    выполнен("выполнен"),
    отменен("отменен");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
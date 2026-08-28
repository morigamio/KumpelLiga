package dev.morigamio.kumpelliga.participant;

import lombok.Getter;

@Getter
public enum Status {
    PENDING("PENDING"), APPROVED("APPROVED"), DENIED("DENIED");

    private final String label;

    Status(String label) {
        this.label = label;
    }

}

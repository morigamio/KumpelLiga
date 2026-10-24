package dev.morigamio.kumpelliga.league;

import lombok.Getter;

@Getter
enum Status {
    PENDING("PENDING"), APPROVED("APPROVED"), DENIED("DENIED");

    private final String label;

    Status(String label) {
        this.label = label;
    }

}

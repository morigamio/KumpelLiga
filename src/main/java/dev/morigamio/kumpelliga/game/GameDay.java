package dev.morigamio.kumpelliga.game;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Getter
public class GameDay {
    @Id
    private int gameDay;
    private LocalDateTime updateTimeStamp;

    protected GameDay() {}

    protected GameDay(int gameDay, LocalDateTime updateTimeStamp) {
        this.gameDay = gameDay;
        this.updateTimeStamp = updateTimeStamp;
    }
}

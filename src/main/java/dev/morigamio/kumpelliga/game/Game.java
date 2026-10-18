package dev.morigamio.kumpelliga.game;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Game {

    @Version
    private Long version;
    @Id
    private Long id;
    private String homeTeam;
    private String awayTeam;
    private int goalsHomeTeam;
    private int goalsAwayTeam;
    private String winner;
    private LocalDateTime matchTime;
    private int gameDay;
    private boolean isFinished;

    // match times are stored as German local time, so "now" has to be German time as well
    public boolean hasStarted() {
        return !matchTime.isAfter(LocalDateTime.now(ZoneId.of("Europe/Berlin")));
    }
}

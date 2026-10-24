package dev.morigamio.kumpelliga.game;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Getter
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

    protected Game() {
    }

    // match times are stored as German local time, so "now" has to be German time as well
    public boolean hasStarted() {
        return !matchTime.isAfter(LocalDateTime.now(ZoneId.of("Europe/Berlin")));
    }

    void setId(Long id) {
        this.id = id;
    }

    void setHomeTeam(String homeTeam) {
        this.homeTeam = homeTeam;
    }

    void setAwayTeam(String awayTeam) {
        this.awayTeam = awayTeam;
    }

    void setGoalsHomeTeam(int goalsHomeTeam) {
        this.goalsHomeTeam = goalsHomeTeam;
    }

    void setGoalsAwayTeam(int goalsAwayTeam) {
        this.goalsAwayTeam = goalsAwayTeam;
    }

    void setWinner(String winner) {
        this.winner = winner;
    }

    void setMatchTime(LocalDateTime matchTime) {
        this.matchTime = matchTime;
    }

    void setGameDay(int gameDay) {
        this.gameDay = gameDay;
    }

    void setFinished(boolean finished) {
        isFinished = finished;
    }
}

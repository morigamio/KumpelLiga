package dev.morigamio.kumpelliga.game;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

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
}

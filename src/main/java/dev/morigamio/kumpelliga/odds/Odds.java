package dev.morigamio.kumpelliga.odds;

import dev.morigamio.kumpelliga.game.Game;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Odds {

    protected Odds(){}

    @Id
    @GeneratedValue
    private Long id;
    @OneToOne
    private Game game;
    private double oddsHome;
    private double oddsAway;
    private double oddsDraw;
}

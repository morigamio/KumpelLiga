package dev.morigamio.kumpelliga.odds;

import dev.morigamio.kumpelliga.game.Game;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Odds {

    @Id
    @GeneratedValue
    private Long id;
    @OneToOne
    private Game game;
    private double oddsHome;
    private double oddsAway;
    private double oddsDraw;
}

package dev.morigamio.kumpelliga.bet;

import dev.morigamio.kumpelliga.game.Game;
import dev.morigamio.kumpelliga.participant.Participant;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Bet {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Game game;// one bet out of many is for one game

    @ManyToOne
    private Participant participant; // one bet out of many has only one owner

    private String prediction;
    private float stake;
    private boolean isPaid;
    private boolean isDouble;

    public Bet(Game game, Participant participant, String prediction) {
        this.game = game;
        this.participant = participant;
        this.prediction = prediction;
        this.isPaid = false;
    }
}

package dev.morigamio.kumpelliga.bet;

import dev.morigamio.kumpelliga.game.Game;
import dev.morigamio.kumpelliga.league.Participant;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Entity
@Getter
class Bet {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Game game;// one bet out of many is for one game

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Participant participant; // one bet out of many has only one owner

    private String prediction;
    private float stake;
    private boolean isPaid;
    private boolean isDouble;
    private BigDecimal winnings;

    protected Bet() {
    }

    protected Bet(Game game, Participant participant, String prediction) {
        this.game = game;
        this.participant = participant;
        this.prediction = prediction;
        this.isPaid = false;
    }

    // a bet belongs to whoever owns its participant
    public boolean isOwnedBy(String accountName) {
        return participant.isOwnedBy(accountName);
    }

    public void payout(BigDecimal winnings) {
        if (!game.isFinished()) return;
        participant.payoutBet(winnings);
        this.isPaid = true;
        this.winnings = winnings;
    }

    void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    void setDouble(boolean aDouble) {
        isDouble = aDouble;
    }
}

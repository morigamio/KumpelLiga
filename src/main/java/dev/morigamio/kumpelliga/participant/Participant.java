package dev.morigamio.kumpelliga.participant;

import dev.morigamio.kumpelliga.account.Account;
import dev.morigamio.kumpelliga.bet.Bet;
import dev.morigamio.kumpelliga.league.League;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(uniqueConstraints = @UniqueConstraint(
        columnNames = {"account_id", "league_id"}
))
@NoArgsConstructor
@AllArgsConstructor
public class Participant {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Account account;
    private String name; // convenience

    @ManyToOne
    private League league;
    private String leagueName; // convenience

    private BigDecimal balance;
    private String status;
    private BigDecimal highestWin;

    @OneToMany(mappedBy = "participant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bet> bets; // each participant can have many bets

    public Participant(Account account, League league, Status status) {
        this.account = account;
        this.name = account.getName();
        this.league = league;
        this.leagueName = league.getName();
        this.balance = BigDecimal.valueOf(0);
        this.status = status.getLabel();
        this.bets = new ArrayList<>();
        this.highestWin = BigDecimal.valueOf(0);
    }

    public void addPoints(BigDecimal winnings) {
        this.highestWin = highestWin.max(winnings);
        this.balance = this.balance.add(winnings);
    }

    public BigDecimal avgWinRate() {
        int noBets = bets.size();
        if (noBets != 0) return balance.divide(BigDecimal.valueOf(bets.size()), 2, RoundingMode.HALF_UP);
        return BigDecimal.valueOf(0);
    }
}
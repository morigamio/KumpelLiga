package dev.morigamio.kumpelliga.league;

import dev.morigamio.kumpelliga.account.Account;
import jakarta.persistence.*;
import lombok.Getter;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Getter
@Table(uniqueConstraints = @UniqueConstraint(
        columnNames = {"account_id", "league_id"}
))
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

    @Enumerated(EnumType.STRING)
    private Status status;

    private BigDecimal balance;
    private BigDecimal highestWin;
    private int noPaidBets;

    protected Participant(){}

    protected Participant(Account account, League league) {
        this.account = account;
        this.name = account.getName();
        this.league = league;
        this.leagueName = league.getName();
        this.balance = BigDecimal.valueOf(0);
        this.status = Status.APPROVED;
        this.highestWin = BigDecimal.valueOf(0);
        this.noPaidBets = 0;
    }

    public boolean isOwnedBy(String accountName) {
        return account.getName().equals(accountName);
    }

    public boolean isParticipant(long leagueId){
        return league.getId().equals(leagueId);
    }

    public void payoutBet(BigDecimal winnings) {
        this.highestWin = highestWin.max(winnings);
        this.balance = this.balance.add(winnings);
        this.noPaidBets++;
    }

    public BigDecimal avgWinRate() {
        if (noPaidBets != 0) return balance.divide(BigDecimal.valueOf(noPaidBets), 2, RoundingMode.HALF_UP);
        return BigDecimal.valueOf(0);
    }

    public void approve(){
        status = Status.APPROVED;
    }

    @Getter
    enum Status {
        PENDING, APPROVED, DENIED;
    }
}
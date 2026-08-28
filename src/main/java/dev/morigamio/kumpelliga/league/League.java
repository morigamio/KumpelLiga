package dev.morigamio.kumpelliga.league;

import dev.morigamio.kumpelliga.account.Account;
import dev.morigamio.kumpelliga.participant.Participant;
import dev.morigamio.kumpelliga.participant.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor
public class League {

    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true)
    private String name;

    private String password; // in case the owner wants to make the league private

    @ManyToOne
    private Account admin; // one league out of many has only one owner

    @OneToMany(mappedBy = "league", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Participant> participants; // each league can have many participants

    public League (String name, String password, Account admin){
        this.name = name;
        this.admin = admin;
        this.password = password;
        this.participants = new ArrayList<>();
        this.participants.add(new Participant(admin, this, Status.APPROVED)); // admin of the league is also participant
    }

    public League (String name, String password, Account admin, BigDecimal startBalance, Set<Participant> participants){
        this();
        this.participants.addAll(participants);
    }

    public boolean hasParticipant(long participantId){
        return participants.stream().anyMatch(p -> p.getId().equals(participantId));
    }
}

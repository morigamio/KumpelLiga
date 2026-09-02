package dev.morigamio.kumpelliga.bet;

import dev.morigamio.kumpelliga.participant.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BetRepository extends JpaRepository<Bet,Long> {
    boolean existsByParticipantIdAndGameId(Long participantId, Long gameId);
    List<Bet> findByIsPaidFalse();
    List<Bet> findByParticipantId(Long id);
    List<Bet> findByParticipantAndGame_GameDay(Participant participant, int gameDay);
}

package dev.morigamio.kumpelliga.bet;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BetRepository extends JpaRepository<Bet,Long> {
    boolean existsByParticipantIdAndGameId(Long participantId, Long gameId);
    List<Bet> findByIsPaidFalse();
    List<Bet> findByParticipantId(Long id);
    List<Bet> findByParticipantIdAndGameId(Long participantId, Long gameId);
}

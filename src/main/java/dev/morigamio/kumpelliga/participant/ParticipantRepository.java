package dev.morigamio.kumpelliga.participant;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    Optional<Participant> findByNameAndLeagueId(String name, Long leagueId);

    List<Participant> findByLeagueId(Long leagueId);

    List<Participant> findRankingByLeagueId(long leagueId, Sort criteria);
}

package dev.morigamio.kumpelliga.league;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

interface LeagueRepository extends JpaRepository<League, Long> {
    List<League> findByNameContainingIgnoreCase(String name);

    Optional<League> findByName(String name);

    List<League> findByParticipantsAccountName(String accountName);
}

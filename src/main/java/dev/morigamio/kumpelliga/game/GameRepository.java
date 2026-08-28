package dev.morigamio.kumpelliga.game;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    Optional<Game> findByHomeTeamAndAwayTeam(String homeTeam, String awayTeam);
}

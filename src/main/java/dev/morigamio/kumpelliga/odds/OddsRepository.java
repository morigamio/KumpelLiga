package dev.morigamio.kumpelliga.odds;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@SuppressWarnings("NullableProblems")
@Repository
public interface OddsRepository extends JpaRepository<Odds, Long> {
    Optional<Odds> findByGameId(Long gameId);
}

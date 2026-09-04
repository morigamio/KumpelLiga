package dev.morigamio.kumpelliga.game;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface GameDayRepository  extends JpaRepository<GameDay, Integer> {
}

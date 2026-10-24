package dev.morigamio.kumpelliga.game;

import org.springframework.data.jpa.repository.JpaRepository;


interface GameDayRepository  extends JpaRepository<GameDay, Integer> {
}

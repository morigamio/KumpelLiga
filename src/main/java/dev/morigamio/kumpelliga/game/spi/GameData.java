package dev.morigamio.kumpelliga.game.spi;

import java.time.LocalDateTime;

public record GameData(Long gameId, LocalDateTime matchTime, String homeTeam, String awayTeam, boolean matchFinished, int gameDay, int goalsHomeTeam, int goalsAwayTeam) {
}


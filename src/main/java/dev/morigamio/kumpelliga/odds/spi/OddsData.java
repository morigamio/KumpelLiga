package dev.morigamio.kumpelliga.odds.spi;

import java.time.LocalDateTime;

public record OddsData(String homeTeam, String awayTeam, double oddsHome, double oddsAway, double oddsDraw, LocalDateTime matchTime) {
}

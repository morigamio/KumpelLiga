package dev.morigamio.kumpelliga.odds.spi;

public record OddsData(String homeTeam, String awayTeam, double oddsHome, double oddsAway, double oddsDraw) {
}

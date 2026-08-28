package dev.morigamio.kumpelliga.game;

import dev.morigamio.kumpelliga.odds.Odds;

import java.time.LocalDateTime;

public record GameDTO (Long id, String homeTeam, String awayTeam, int gameDay, double oddsHome, double oddsAway, double oddsDraw, int goalsHomeTeam, int goalsAwayTeam, String winner, boolean isFinished, LocalDateTime matchTime) {

    public static GameDTO from(Game game) {
        return new GameDTO(
                game.getId(),
                game.getHomeTeam(),
                game.getAwayTeam(),
                game.getGameDay(),
                0,
                0,
                0,
                game.getGoalsHomeTeam(),
                game.getGoalsAwayTeam(),
                game.getWinner(),
                game.isFinished(),
                game.getMatchTime()
        );
    }

    public static GameDTO from(Game game, Odds odds) {
        return new GameDTO(
                game.getId(),
                game.getHomeTeam(),
                game.getAwayTeam(),
                game.getGameDay(),
                odds.getOddsHome(),
                odds.getOddsAway(),
                odds.getOddsDraw(),
                game.getGoalsHomeTeam(),
                game.getGoalsAwayTeam(),
                game.getWinner(),
                game.isFinished(),
                game.getMatchTime()
        );
    }
}

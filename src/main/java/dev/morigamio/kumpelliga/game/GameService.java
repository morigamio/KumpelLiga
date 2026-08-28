package dev.morigamio.kumpelliga.game;

import dev.morigamio.kumpelliga.game.spi.GameData;
import dev.morigamio.kumpelliga.game.spi.GameDataClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class GameService {

    private final GameDataClient gameDataClient;
    private final GamePersistence gamePersistence;

    public GameService(GameDataClient gameDataClient, GamePersistence gamePersistence) {
        this.gameDataClient = gameDataClient;
        this.gamePersistence = gamePersistence;
    }

    public List<Game> getGames() {
        return gamePersistence.findAll();
    }

    public Optional<Game> getGameById(Long gameId) {
        return gamePersistence.findById(gameId);
    }

    public Optional<Game> getGameByTeamNames(String homeTeam, String awayTeam) {
        return gamePersistence.findByHomeTeamAndAwayTeam(homeTeam, awayTeam);
    }

    public void syncGames() {
        try {
            List<GameData> gameData = gameDataClient.retrieveGameData();
            List<Game> games = new ArrayList<>();
            for (GameData data : gameData) {
                Game game = gamePersistence.findById(data.gameId()).orElse(new Game());
                game.setId(data.gameId());
                game.setHomeTeam(data.homeTeam());
                game.setAwayTeam(data.awayTeam());
                game.setGameDay(data.gameDay());
                game.setMatchTime(data.matchTime());
                game.setGoalsHomeTeam(data.goalsHomeTeam());
                game.setGoalsAwayTeam(data.goalsAwayTeam());
                game.setWinner(determineWinner(data.goalsHomeTeam(), data.goalsAwayTeam()));
                game.setFinished(data.matchFinished());
                games.add(game);
            }
            gamePersistence.storeGames(games);
        } catch (Exception e) {
            log.error("syncGames: ", e);
        }
    }

    private String determineWinner(int goalsHomeTeam, int goalsAwayTeam) {
        if (goalsHomeTeam == goalsAwayTeam) {
            return GameConstants.DRAW;
        } else if (goalsHomeTeam > goalsAwayTeam) {
            return GameConstants.HOME_TEAM;
        }
        return GameConstants.AWAY_TEAM;
    }
}

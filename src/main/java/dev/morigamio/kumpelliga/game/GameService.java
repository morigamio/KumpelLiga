package dev.morigamio.kumpelliga.game;

import dev.morigamio.kumpelliga.game.spi.GameData;
import dev.morigamio.kumpelliga.game.spi.GameDataClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    public List<Game> getGamesByGameDay(int gameDay) {
        return gamePersistence.findByGameDay(gameDay);
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
            LocalDateTime updateTimeStamp = LocalDateTime.MIN;
            int previousGameDay = 0;
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

                // if next game day is reached, store latest update timestamp and reset the variable for next gameday
                int currentGameDay = data.gameDay();
                if (previousGameDay != 0 && currentGameDay != previousGameDay) {
                    gamePersistence.storeGameDay(new GameDay(previousGameDay, updateTimeStamp));
                    updateTimeStamp = LocalDateTime.MIN;
                }
                previousGameDay = currentGameDay;

                // update latest update timestamp
                boolean isTimeStampNewer = data.updateTimeStamp().isAfter(updateTimeStamp);
                if (isTimeStampNewer) updateTimeStamp = data.updateTimeStamp();
            }
            // store latest update timestamp for last gameday
            if (previousGameDay != 0) {
                gamePersistence.storeGameDay(new GameDay(previousGameDay, updateTimeStamp));
            }
            gamePersistence.storeGames(games);
            log.info("Games synchronized successfully.");
        } catch (Exception e) {
            log.error("syncGames: ", e);
        }
    }

    public void syncGamesByGameDay(int gameDay) {
        try {
            List<GameData> gameData = gameDataClient.retrieveGameData(gameDay);
            LocalDateTime updateTimeStamp = LocalDateTime.MIN;
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

                // update latest retrieval timestamp
                boolean isTimeStampNewer = data.updateTimeStamp().isAfter(updateTimeStamp);
                if (isTimeStampNewer) updateTimeStamp = data.updateTimeStamp();
            }
            gamePersistence.storeGames(games);
            gamePersistence.storeGameDay(new GameDay(gameDay, updateTimeStamp));
            log.info("Games for gameday %s synchronized successfully. Set UpdateTimestamp to %s".formatted(gameDay, updateTimeStamp));
        } catch (Exception e) {
            log.error("syncGamesByGameDay: ", e);
        }
    }

    public boolean isGameDataUpToDate(int gameDay) {
        LocalDateTime oldTimeStamp = gamePersistence.findGameDay(gameDay)
                .orElseThrow(() -> new RuntimeException("There is no timestamp for gameday %s to retrieve." + gameDay))
                .getUpdateTimeStamp();
        LocalDateTime newTimeStamp = gameDataClient.retrieveUpdateTimeStamp(gameDay);
        return oldTimeStamp.equals(newTimeStamp);
    }

    public List<GameDay> getAllGameDays(){
        return gamePersistence.findAllGameDays();
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

package dev.morigamio.kumpelliga.game;

import dev.morigamio.kumpelliga.metadata.MetaData;
import dev.morigamio.kumpelliga.metadata.MetaDataConstants;
import dev.morigamio.kumpelliga.metadata.MetaDataRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * This is a wrapper class for the Game Repository.
 * The reason this class exists are the @Transactional annotations, which can not be called within the game service or otherwise
 * would not be triggered by internal methods calls.
 */
@Repository
public class GamePersistence {

    private final GameRepository gameRepository;
    private final GameDayRepository gameDayRepository;

    public GamePersistence(GameRepository gameRepository, GameDayRepository gameDayRepository) {
        this.gameRepository = gameRepository;
        this.gameDayRepository = gameDayRepository;
    }

    @Transactional
    public void storeGames(List<Game> games) {
        for (Game game : games) {
            gameRepository.save(game);
        }
    }

    public List<Game> findAll() {
        return gameRepository.findAll();
    }

    public Optional<Game> findById(Long id){
        return gameRepository.findById(id);
    }

    public Optional<Game> findByHomeTeamAndAwayTeam(String homeTeam, String awayTeam){
        return gameRepository.findByHomeTeamAndAwayTeam(homeTeam, awayTeam);
    }
}

package dev.morigamio.kumpelliga.odds;

import dev.morigamio.kumpelliga.game.Game;
import dev.morigamio.kumpelliga.game.GameService;
import dev.morigamio.kumpelliga.odds.spi.OddsData;
import dev.morigamio.kumpelliga.odds.spi.OddsDataClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OddsService {
    private final OddsDataClient oddsDataClient;
    private final OddsPersistence oddsPersistence;
    private final GameService gameService;

    public OddsService(OddsDataClient oddsDataClient, OddsPersistence oddsPersistence, GameService gameService) {
        this.oddsDataClient = oddsDataClient;
        this.oddsPersistence = oddsPersistence;
        this.gameService = gameService;
    }

    public Map<Long, Odds> getOddsByGameIds() {
        List<Odds> odds = oddsPersistence.findAll();
        return odds.stream()
                .collect(Collectors.toMap(
                        o -> o.getGame().getId(),
                        o -> o
                ));
    }

    public Optional<Odds> getOddsByGameId(Long gameId) {
        return oddsPersistence.findById(gameId);
    }

    public void syncOdds() {
        try {
            List<OddsData> oddData = oddsDataClient.retrieveOdds();
            List<Odds> odds = new ArrayList<>();
            for (OddsData data : oddData) {
                Optional<Game> optGame = gameService.getGameByTeamNames(data.homeTeam(), data.awayTeam());
                if (optGame.isEmpty()) {
                    log.error("Can not find game with homeTeam: %s and awayTeam: %s".formatted(data.homeTeam(), data.awayTeam()));
                    continue;
                }
                Odds odd = oddsPersistence.findById(optGame.get().getId()).orElse(new Odds());
                odd.setGame(optGame.get());
                odd.setOddsHome(data.oddsHome());
                odd.setOddsAway(data.oddsAway());
                odd.setOddsDraw(data.oddsDraw());
                odds.add(odd);
            }
            oddsPersistence.storeOdds(odds);
            log.info("Odds synchronized successfully.");
        } catch (Exception e) {
            log.error("syncOdds: ", e);
        }
    }
}

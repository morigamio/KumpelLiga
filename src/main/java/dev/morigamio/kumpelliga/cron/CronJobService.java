package dev.morigamio.kumpelliga.cron;

import dev.morigamio.kumpelliga.bet.BetService;
import dev.morigamio.kumpelliga.game.GameService;
import dev.morigamio.kumpelliga.game.OddsService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
class CronJobService {
    private final GameService gameService;
    private final OddsService oddsService;
    private final BetService betService;

    CronJobService(GameService gameService, OddsService oddsService, BetService betService) {
        this.gameService = gameService;
        this.oddsService = oddsService;
        this.betService = betService;
    }

    @Scheduled(cron = "${sync.cron.liveTracking}")
    void syncResultsAndCalculate() {
        gameService.syncChangedGames();
        betService.payoutBets();
    }

    @Scheduled(cron = "${sync.cron.odds}")
    void synchronizeOddsData() {
        oddsService.syncOdds();
    }
}

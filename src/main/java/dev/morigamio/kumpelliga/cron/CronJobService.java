package dev.morigamio.kumpelliga.cron;

import dev.morigamio.kumpelliga.game.GameService;
import dev.morigamio.kumpelliga.game.OddsService;
import dev.morigamio.kumpelliga.settlement.SettlementService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
class CronJobService {
    private final GameService gameService;
    private final OddsService oddsService;
    private final SettlementService settlementService;

    CronJobService(GameService gameService, OddsService oddsService, SettlementService settlementService) {
        this.gameService = gameService;
        this.oddsService = oddsService;
        this.settlementService = settlementService;
    }

    @Scheduled(cron = "${sync.cron.liveTracking}")
    void syncResultsAndCalculate() {
        gameService.synChangedGames();
        settlementService.calculatePayout();
    }

    @Scheduled(cron = "${sync.cron.odds}")
    void synchronizeOddsData() {
        oddsService.syncOdds();
    }
}

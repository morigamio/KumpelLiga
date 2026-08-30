package dev.morigamio.kumpelliga.cron;

import dev.morigamio.kumpelliga.game.GameService;
import dev.morigamio.kumpelliga.odds.OddsService;
import dev.morigamio.kumpelliga.settlement.SettlementService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class CronJobService {
    private final GameService gameService;
    private final OddsService oddsService;
    private final SettlementService settlementService;

    public CronJobService(GameService gameService, OddsService oddsService, SettlementService settlementService) {
        this.gameService = gameService;
        this.oddsService = oddsService;
        this.settlementService = settlementService;
    }

    @Scheduled(cron = "${sync.cron}")
    public void synchronizeData() {
        gameService.syncGames();
        oddsService.syncOdds();
        settlementService.calculatePayout();

    }
}

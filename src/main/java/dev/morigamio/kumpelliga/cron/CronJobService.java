package dev.morigamio.kumpelliga.cron;

import dev.morigamio.kumpelliga.game.GameDay;
import dev.morigamio.kumpelliga.game.GameService;
import dev.morigamio.kumpelliga.odds.OddsService;
import dev.morigamio.kumpelliga.settlement.SettlementService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

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

    @Scheduled(cron = "${sync.cron.liveTracking}")
    public void syncResultsAndCalculate() {
        List<GameDay> gameDays = gameService.getAllGameDays();
        for (GameDay gameDay : gameDays) {
            boolean gameDataUpToDate = gameService.isGameDataUpToDate(gameDay.getGameDay());
            if (!gameDataUpToDate) {
                gameService.syncGamesByGameDay(gameDay.getGameDay());
                settlementService.calculatePayout();
            }
        }
    }

    @Scheduled(cron = "${sync.cron.odds}")
    public void synchronizeOddsData() {
        oddsService.syncOdds();
    }
}

package dev.morigamio.kumpelliga.startup;

import dev.morigamio.kumpelliga.game.GameService;
import dev.morigamio.kumpelliga.odds.OddsService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class StartupSync {

    private final GameService gameService;
    private final OddsService oddsService;

    public StartupSync(GameService gameService, OddsService oddsService) {
        this.gameService = gameService;
        this.oddsService = oddsService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        gameService.syncGames();   // must run first — odds links to games
        oddsService.syncOdds();    // depends on games existing
    }
}

package dev.morigamio.kumpelliga.settlement;

import dev.morigamio.kumpelliga.bet.Bet;
import dev.morigamio.kumpelliga.bet.BetService;
import dev.morigamio.kumpelliga.game.Game;
import dev.morigamio.kumpelliga.game.GameConstants;
import dev.morigamio.kumpelliga.game.GameService;
import dev.morigamio.kumpelliga.odds.Odds;
import dev.morigamio.kumpelliga.odds.OddsService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class SettlementService {
    private final BetService betService;
    private final OddsService oddsService;
    private final GameService gameService;

    public SettlementService(BetService betService, OddsService oddsService, GameService gameService) {
        this.betService = betService;
        this.oddsService = oddsService;
        this.gameService = gameService;
    }

    @Transactional
    public void calculatePayout() {
        try {
            Map<Long, List<Bet>> betsByGameId = betService.getUnpaidBetsByGameIds();

            for (Map.Entry<Long, List<Bet>> entry : betsByGameId.entrySet()) {
                Game game = gameService.getGameById(entry.getKey())
                        .orElseThrow();

                if (!game.isFinished()) continue;

                Odds odds = oddsService.getOddsByGameId(entry.getKey())
                        .orElseThrow();

                for (Bet bet : entry.getValue()) {
                    BigDecimal winnings = calculateWinnings(bet, odds);
                    bet.getParticipant().addPoints(winnings);
                    bet.setPaid(true);
                    bet.setWinnings(winnings);
                }
            log.info("Winnings paid out for game %s vs. %s".formatted(game.getHomeTeam(), game.getAwayTeam()));
            }
        } catch (Exception e) {
            log.error("calculatePayout: ", e);
        }
    }

    private BigDecimal calculateWinnings(Bet bet, Odds odds) {
        String prediction = bet.getPrediction();
        String winner = bet.getGame().getWinner();
        boolean isDouble = bet.isDouble();
        BigDecimal winnings =  BigDecimal.valueOf(0);
        if (winner.equals(prediction)) {
            switch (prediction) {
                case GameConstants.HOME_TEAM -> winnings = BigDecimal.valueOf(odds.getOddsHome());
                case GameConstants.AWAY_TEAM -> winnings = BigDecimal.valueOf(odds.getOddsAway());
                case GameConstants.DRAW -> winnings = BigDecimal.valueOf(odds.getOddsDraw());
                default ->
                        log.error("Prediction by participant %s does not match a valid outcome, %s".formatted(bet.getParticipant().getName(), prediction));
            }
        }
        return isDouble ? winnings.multiply(BigDecimal.valueOf(2)) : winnings;
    }
}
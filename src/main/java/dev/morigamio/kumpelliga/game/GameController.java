package dev.morigamio.kumpelliga.game;

import dev.morigamio.kumpelliga.odds.Odds;
import dev.morigamio.kumpelliga.odds.OddsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
class GameController {

    GameService gameService;
    OddsService oddsService;

    GameController(GameService gameService, OddsService oddsService) {
        this.gameService = gameService;
        this.oddsService = oddsService;
    }

    /**
     * All games, or only those of one matchday when ?gameDay=N is given (used for live polling).
     */
    @GetMapping("/games")
    ResponseEntity<List<GameDTO>> getGames(@RequestParam(required = false) Integer gameDay) {
        List<Game> games = gameDay == null ? gameService.getGames() : gameService.getGamesByGameDay(gameDay);
        Map<Long, Odds> oddsByGameIds = oddsService.getOddsByGameIds();
        List<GameDTO> result = new ArrayList<>();

        for (Game game : games) {
            Odds odds = oddsByGameIds.get(game.getId());
            if (odds != null) {
                result.add(GameDTO.from(game, odds));
                continue;
            }
            result.add(GameDTO.from(game));
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/gamedays/current")
    ResponseEntity<Integer> getCurrentGameDay() {
        return new ResponseEntity<>(gameService.getCurrentGameDay(), HttpStatus.OK);
    }

    @GetMapping("/gamedays/count")
    ResponseEntity<Integer> getGameDayCount() {
        return new ResponseEntity<>(gameService.getGameDayCount(), HttpStatus.OK);
    }
}

package dev.morigamio.kumpelliga.utils;

import dev.morigamio.kumpelliga.exception.ResourceNotFoundException;
import dev.morigamio.kumpelliga.game.Game;
import dev.morigamio.kumpelliga.game.GameDTO;
import dev.morigamio.kumpelliga.game.GameService;
import dev.morigamio.kumpelliga.odds.Odds;
import dev.morigamio.kumpelliga.odds.OddsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class TestController {

    @Autowired
    GameService gameService;

    @Autowired
    OddsService oddsService;

    @GetMapping("/test/1")
    public ResponseEntity<List<GameDTO>> test1(){
        List<Game> games = gameService.getGames();
        Map<Long, Odds> oddsByGameId = oddsService.getOddsByGameIds();
        List<GameDTO> result = new ArrayList<>();

        for (Game game : games) {
            Odds odds = oddsByGameId.get(game.getId());
            if (odds != null) {
                result.add(GameDTO.from(game, odds));
                continue;
            }
            result.add(GameDTO.from(game));
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/test/2/{gameId}")
    public ResponseEntity<GameDTO> test2(@RequestBody String gameId){
        Game game = gameService.getGameById(Long.parseLong(gameId)).orElseThrow(() -> new ResourceNotFoundException(Game.class, Long.parseLong(gameId)));
        Optional<Odds> oddsByGameId = oddsService.getOddsByGameId(game.getId());
        return oddsByGameId.map(
                        odds -> new ResponseEntity<>(GameDTO.from(game, odds), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(GameDTO.from(game), HttpStatus.OK));
    }
}

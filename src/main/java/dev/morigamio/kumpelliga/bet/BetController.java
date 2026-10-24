package dev.morigamio.kumpelliga.bet;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
class BetController {

    private final BetService betService;

    BetController(BetService betService) {
        this.betService = betService;
    }

    @GetMapping("/participants/{participantId}/bets")
    ResponseEntity<List<ReadBetDTO>> getBetsByParticipant(@PathVariable String participantId, Principal principal) {
        List<Bet> betsByParticipant = betService.getBetsByParticipantId(principal.getName(), Long.parseLong(participantId));
        return new ResponseEntity<>(betsByParticipant.stream().map(ReadBetDTO::from).toList(), HttpStatus.OK);
    }

    @GetMapping("/leagues/{leagueId}/bets")
    ResponseEntity<List<ReadBetDTO>> getPaidBetsByLeagueId(@PathVariable String leagueId, Principal principal) {
        List<Bet> paidBetsByLeagueId = betService.getPaidBetsByLeagueId(principal.getName(), Long.parseLong(leagueId));
        return new ResponseEntity<>(paidBetsByLeagueId.stream().map(ReadBetDTO::from).toList(), HttpStatus.OK);
    }

    @GetMapping("/leagues/{leagueId}/bets/mine")
    ResponseEntity<List<ReadBetDTO>> getMyBetsByLeagueId(@PathVariable String leagueId, Principal principal) {
        List<Bet> myBets = betService.getMyBetsByLeagueId(principal.getName(), Long.parseLong(leagueId));
        return new ResponseEntity<>(myBets.stream().map(ReadBetDTO::from).toList(), HttpStatus.OK);
    }

    @PostMapping("/leagues/{leagueId}/games/{gameId}/bets")
    ResponseEntity<ReadBetDTO> createBet(@RequestBody CreateBetDTO data, @PathVariable String leagueId, @PathVariable String gameId, Principal principal) {
        Bet bet = betService.registerBet(
                leagueId,
                Long.parseLong(gameId),
                principal.getName(),
                //data.stake(),
                data.prediction()
        );
        return new ResponseEntity<>(ReadBetDTO.from(bet), HttpStatus.CREATED);
    }

    @PutMapping("/bets/{betId}")
    ResponseEntity<ReadBetDTO> updateBet(@RequestBody UpdateBetDTO data, @PathVariable String betId, Principal principal) {
        Bet bet = betService.updateBet(
                principal.getName(),
                Long.parseLong(betId),
                data.prediction()
                //data.stake()
        );
        return new ResponseEntity<>(ReadBetDTO.from(bet), HttpStatus.OK);
    }

    @PutMapping("/bets/{betId}/double")
    ResponseEntity<List<ReadBetDTO>> updateBetToDouble(@PathVariable String betId, Principal principal) {
        List<Bet> betsByParticipant = betService.updateBetToDouble(
                principal.getName(),
                Long.parseLong(betId)
        );
        return new ResponseEntity<>(betsByParticipant.stream().map(ReadBetDTO::from).toList(), HttpStatus.OK);
    }

    @DeleteMapping("/bets/{betId}/double")
    ResponseEntity<List<ReadBetDTO>> updateBetToSingle(@PathVariable String betId, Principal principal) {
        List<Bet> betsByParticipant = betService.updateBetToSingle(
                principal.getName(),
                Long.parseLong(betId)
        );
        return new ResponseEntity<>(betsByParticipant.stream().map(ReadBetDTO::from).toList(), HttpStatus.OK);
    }

    @DeleteMapping("/bets/{betId}")
    ResponseEntity<Void> deleteBet(@PathVariable String betId, Principal principal) {
        betService.deleteBet(principal.getName(), Long.parseLong(betId));
        return ResponseEntity.noContent().build();
    }
}

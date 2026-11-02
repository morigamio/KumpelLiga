package dev.morigamio.kumpelliga.league;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
class LeagueController {

    private final LeagueService leagueService;

    LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }

    @PostMapping("/leagues")
    ResponseEntity<ReadLeagueDTO> createLeague(@RequestBody CreateLeagueDTO data, Principal principal) {
        League league = leagueService.createLeague(data.name(), principal.getName(), data.password());
        return new ResponseEntity<>(ReadLeagueDTO.from(league), HttpStatus.CREATED);
    }

    @PostMapping("/leagues/{leagueId}/participants")
    ResponseEntity<ReadParticipantDTO> joinLeague(@PathVariable String leagueId, @RequestBody JoinLeagueDTO data, Principal principal) {
        Participant participant = leagueService.joinLeague(Long.parseLong(leagueId), principal.getName(), data.password());
        return new ResponseEntity<>(ReadParticipantDTO.from(participant), HttpStatus.CREATED);
    }

    @DeleteMapping("/participants/{participantId}")
    ResponseEntity<Void> leaveLeague(@PathVariable String participantId, Principal principal) {
        leagueService.leaveLeague(Long.parseLong(participantId), principal.getName());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/leagues/{leagueId}")
    ResponseEntity<Void> deleteLeague(@PathVariable String leagueId, Principal principal) {
        leagueService.deleteLeague(Long.parseLong(leagueId), principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/leagues")
    ResponseEntity<List<ReadLeagueSummaryDTO>> getLeagues(@RequestParam(required = false) String name) {
        if (name == null || name.isBlank()) {
            return new ResponseEntity<>(leagueService.getLeagues().stream().map(ReadLeagueSummaryDTO::from).toList(), HttpStatus.OK);
        }
        return new ResponseEntity<>(leagueService.getLeaguesByName(name).stream().map(ReadLeagueSummaryDTO::from).toList(), HttpStatus.OK);
    }

    @GetMapping("/account/leagues")
    ResponseEntity<List<ReadLeagueDTO>> getMyLeagues(Principal principal) {
        return new ResponseEntity<>(leagueService.getMyLeagues(principal.getName()).stream().map(ReadLeagueDTO::from).toList(), HttpStatus.OK);
    }

    @GetMapping("/leagues/{leagueId}")
    ResponseEntity<ReadLeagueDTO> getLeague(@PathVariable String leagueId, Principal principal) {
        League league = leagueService.getLeague(Long.parseLong(leagueId), principal.getName());
        return new ResponseEntity<>(ReadLeagueDTO.from(league), HttpStatus.OK);
    }

    @GetMapping("/leagues/{leagueId}/ranking")
    ResponseEntity<List<ReadParticipantDTO>> getRanking(@PathVariable String leagueId, Principal principal) {
        List<Participant> participantsRankedByBalance = leagueService.getRanking(Long.parseLong(leagueId), principal.getName());
        return new ResponseEntity<>(participantsRankedByBalance.stream().map(ReadParticipantDTO::from).toList(), HttpStatus.OK);
    }
}

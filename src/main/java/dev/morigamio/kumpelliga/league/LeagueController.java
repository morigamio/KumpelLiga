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

    @GetMapping("/leagues")
    ResponseEntity<List<ReadLeagueDTO>> getLeagues(@RequestParam(required = false) String name) {
        if (name == null || name.isBlank()) {
            return new ResponseEntity<>(leagueService.getAllLeagues().stream().map(ReadLeagueDTO::from).toList(), HttpStatus.OK);
        }
        return new ResponseEntity<>(leagueService.getLeaguesByName(name).stream().map(ReadLeagueDTO::from).toList(), HttpStatus.OK);
    }

    @GetMapping("/account/leagues")
    ResponseEntity<List<ReadLeagueDTO>> getLeaguesToName(Principal principal) {
        return new ResponseEntity<>(leagueService.getLeaguesByAccountName(principal.getName()).stream().map(ReadLeagueDTO::from).toList(), HttpStatus.OK);
    }

    @GetMapping("/leagues/{leagueId}")
    ResponseEntity<ReadLeagueDTO> getLeagueById(@PathVariable String leagueId) {
        League league = leagueService.getLeagueByLeagueId(Long.parseLong(leagueId));
        return new ResponseEntity<>(ReadLeagueDTO.from(league), HttpStatus.OK);
    }

    @PatchMapping("/leagues/{leagueId}")
    League changeLeagueSettingsById(@PathVariable String leagueId) {
        return null;
    }

    @DeleteMapping("/leagues/{leagueId}")
    ResponseEntity<Void> deleteLeagueById(@PathVariable String leagueId, Principal principal) {
        leagueService.deleteLeagueById(Long.parseLong(leagueId), principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/leagues/{leagueId}/participants")
    ResponseEntity<ReadParticipantDTO> joinLeagueById(@PathVariable String leagueId, @RequestBody JoinLeagueDTO data, Principal principal) {
        Participant participant = leagueService.joinLeague(Long.parseLong(leagueId), principal.getName(), data.password());
        return new ResponseEntity<>(ReadParticipantDTO.from(participant), HttpStatus.CREATED);
    }

    @DeleteMapping("/participants/{participantId}")
    ResponseEntity<Void> removeParticipantById(@PathVariable String participantId, Principal principal) {
        leagueService.removeParticipantById(Long.parseLong(participantId), principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/leagues/{leagueId}/ranking")
    ResponseEntity<List<ReadParticipantDTO>> getLeagueRanking(@PathVariable String leagueId) {
        List<Participant> participantsRankedByBalance = leagueService.getRankingByLeagueId(Long.parseLong(leagueId));
        return new ResponseEntity<>(participantsRankedByBalance.stream().map(ReadParticipantDTO::from).toList(), HttpStatus.OK);
    }
}

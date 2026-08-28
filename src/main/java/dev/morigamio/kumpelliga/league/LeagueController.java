package dev.morigamio.kumpelliga.league;

import dev.morigamio.kumpelliga.exception.ResourceNotFoundException;
import dev.morigamio.kumpelliga.league.dto.CreateLeagueDTO;
import dev.morigamio.kumpelliga.league.dto.JoinLeagueDTO;
import dev.morigamio.kumpelliga.league.dto.ReadLeagueDTO;
import dev.morigamio.kumpelliga.participant.Participant;
import dev.morigamio.kumpelliga.participant.ReadParticipantDTO;
import dev.morigamio.kumpelliga.participant.ParticipantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class LeagueController {

    private final LeagueService leagueService;
    private final ParticipantService participantService;

    public LeagueController(LeagueService leagueService, ParticipantService participantService) {
        this.leagueService = leagueService;
        this.participantService = participantService;
    }

    @PostMapping("/leagues")
    public ResponseEntity<ReadLeagueDTO> createLeague(@RequestBody CreateLeagueDTO data, Principal principal) {
        League league = leagueService.createLeague(data.name(), principal.getName(), data.password());
        return new ResponseEntity<>(ReadLeagueDTO.from(league), HttpStatus.CREATED);
    }

    @GetMapping("/leagues")
    public ResponseEntity<List<ReadLeagueDTO>> getLeaguesByName(@RequestParam(required = false) String name) {
        if (name == null || name.isBlank()) {
            return new ResponseEntity<>(leagueService.getAllLeagues().stream().map(ReadLeagueDTO::from).toList(), HttpStatus.OK);
        }
        return new ResponseEntity<>(leagueService.getLeaguesByName(name).stream().map(ReadLeagueDTO::from).toList(), HttpStatus.OK);
    }

    @GetMapping("/leagues/{leagueId}")
    public ResponseEntity<ReadLeagueDTO> getLeagueById(@PathVariable String leagueId) {
        League league = leagueService.getLeagueByLeagueId(Long.parseLong(leagueId)).orElseThrow(() -> new ResourceNotFoundException(League.class, Long.parseLong(leagueId)));
        return new ResponseEntity<>(ReadLeagueDTO.from(league), HttpStatus.OK);
    }

    @PatchMapping("/leagues/{leagueId}")
    public League changeLeagueSettingsById(@PathVariable String leagueId) {
        return null;
    }

    @DeleteMapping("/leagues/{leagueId}")
    public ResponseEntity<Void> deleteLeagueById(@PathVariable String leagueId) {
        if (leagueService.getLeagueByLeagueId(Long.parseLong(leagueId)).isEmpty())
            throw new ResourceNotFoundException(League.class, Long.parseLong(leagueId));
        leagueService.deleteLeagueById(Long.parseLong(leagueId));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/leagues/{leagueId}/participants")
    public ResponseEntity<List<ReadParticipantDTO>> getParticipantsByLeagueId(@PathVariable String leagueId) {
        League league = leagueService.getLeagueByLeagueId(Long.parseLong(leagueId)).orElseThrow(() -> new ResourceNotFoundException(League.class, Long.parseLong(leagueId)));
        return new ResponseEntity<>(league.getParticipants().stream().map(ReadParticipantDTO::from).toList(), HttpStatus.OK);
    }

    @PostMapping("/leagues/{leagueId}/participants")
    public ResponseEntity<ReadParticipantDTO> joinLeagueById(@PathVariable String leagueId, @RequestBody JoinLeagueDTO data, Principal principal) {
        if (leagueService.getLeagueByLeagueId(Long.parseLong(leagueId)).isEmpty())
            throw new ResourceNotFoundException(League.class, Long.parseLong(leagueId));
        Participant participant = leagueService.joinLeague(Long.parseLong(leagueId), principal.getName(), data.password());
        return new ResponseEntity<>(ReadParticipantDTO.from(participant), HttpStatus.CREATED);
    }

    @DeleteMapping("/participants/{participantId}")
    public ResponseEntity<Void> removeParticipantById(@PathVariable String participantId) {
        participantService.removeParticipantById(Long.parseLong(participantId));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/leagues/{leagueId}/ranking")
    public ResponseEntity<List<ReadParticipantDTO>> getLeagueRanking(@PathVariable String leagueId) {
        leagueService.getLeagueByLeagueId(Long.parseLong(leagueId)).orElseThrow(() -> new ResourceNotFoundException(League.class, Long.parseLong(leagueId)));
        List<Participant> participantsRankedByBalance = participantService.rankingByLeagueId(Long.parseLong(leagueId));
        return new ResponseEntity<>(participantsRankedByBalance.stream().map(ReadParticipantDTO::from).toList(), HttpStatus.OK);
    }
}

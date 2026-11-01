package dev.morigamio.kumpelliga.league;

import dev.morigamio.kumpelliga.account.Account;
import dev.morigamio.kumpelliga.account.AccountService;
import dev.morigamio.kumpelliga.exception.AdminCannotLeaveLeagueException;
import dev.morigamio.kumpelliga.exception.InvalidLeaguePasswordException;
import dev.morigamio.kumpelliga.exception.LeagueAlreadyExistsException;
import dev.morigamio.kumpelliga.exception.NotParticipantException;
import dev.morigamio.kumpelliga.exception.NotResourceOwnerException;
import dev.morigamio.kumpelliga.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
class LeagueService {

    private final LeagueRepository leagueRepository;
    private final AccountService accountService;
    private final ParticipantService participantService;

    LeagueService(LeagueRepository leagueRepository, AccountService accountService, ParticipantService participantService) {
        this.leagueRepository = leagueRepository;
        this.accountService = accountService;
        this.participantService = participantService;
    }

    public League createLeague(String name, String admin, String password) {
        Account account = accountService.getAccountByName(admin);
        boolean leagueExists = leagueRepository.findByName(name).isPresent();
        if (leagueExists) throw new LeagueAlreadyExistsException(name);
        League league = new League(name, password, account);
        return leagueRepository.save(league);
    }

    @Transactional
    public Participant joinLeague(long leagueId, String accountName, String password) {
        League league = leagueRepository.findById(leagueId).orElseThrow(() -> new ResourceNotFoundException(League.class, leagueId)); // no member check: whoever joins is not a member yet
        if (!password.equals(league.getPassword())) {
            throw new InvalidLeaguePasswordException();
        }
        Account account = accountService.getAccountByName(accountName); // user is logged in, account is guaranteed to exist
        return participantService.addParticipant(new Participant(account, league));
    }

    // only the account behind a participant may remove it (= leave the league); the admin can never leave, only delete the league by calling deleteLeague
    public void leaveLeague(long participantId, String accountName) {
        Participant participant = participantService.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException(Participant.class, participantId));
        if (!participant.isOwnedBy(accountName)) throw new NotResourceOwnerException(Participant.class, participantId, accountName);
        boolean isAdmin = accountName.equals(participant.getLeague().getAdmin().getName());
        if (isAdmin) throw new AdminCannotLeaveLeagueException();
        participantService.removeParticipant(participant);
    }

    // only the admin of a league may delete it
    public void deleteLeague(long leagueId, String accountName) {
        League league = leagueRepository.findById(leagueId).orElseThrow(() -> new ResourceNotFoundException(League.class, leagueId));
        boolean isAdmin = accountName.equals(league.getAdmin().getName());
        if (!isAdmin) throw new NotResourceOwnerException(League.class, leagueId, accountName);
        leagueRepository.delete(league);
    }

    public List<League> getLeagues() {
        return leagueRepository.findAll();
    }

    public List<League> getLeaguesByName(String leagueName) {
        return leagueRepository.findByNameContainingIgnoreCase(leagueName);
    }

    public List<League> getMyLeagues(String accountName) {
        return leagueRepository.findByParticipantsAccountName(accountName);
    }

    // a league with its participants is visible to its members only
    public League getLeague(long leagueId, String accountName) {
        League league = leagueRepository.findById(leagueId).orElseThrow(() -> new ResourceNotFoundException(League.class, leagueId));
        boolean isParticipant = participantService.existsByNameAndLeagueId(accountName, leagueId);
        if (!isParticipant) throw new NotParticipantException();
        return league;
    }

    // the ranking is visible to the league's members only
    public List<Participant> getRanking(long leagueId, String accountName) {
        getLeague(leagueId, accountName);
        return participantService.rankingByLeagueId(leagueId);
    }
}

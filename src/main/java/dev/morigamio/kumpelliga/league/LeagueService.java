package dev.morigamio.kumpelliga.league;

import dev.morigamio.kumpelliga.account.Account;
import dev.morigamio.kumpelliga.account.AccountService;
import dev.morigamio.kumpelliga.exception.AdminCannotLeaveLeagueException;
import dev.morigamio.kumpelliga.exception.InvalidLeaguePasswordException;
import dev.morigamio.kumpelliga.exception.LeagueAlreadyExistsException;
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

    public List<League> getAllLeagues() {
        return leagueRepository.findAll();
    }

    public List<League> getLeaguesByName(String leagueName) {
        return leagueRepository.findByNameContainingIgnoreCase(leagueName);
    }

    public List<League> getLeaguesByAccountName(String accountName) {
        return leagueRepository.findByParticipantsAccountName(accountName);
    }

    public League getLeagueByLeagueId(long leagueId) {
        return leagueRepository.findById(leagueId).orElseThrow(() -> new ResourceNotFoundException(League.class, leagueId));
    }

    public List<Participant> getRankingByLeagueId(long leagueId) {
        getLeagueByLeagueId(leagueId); // 404 if the league doesn't exist
        return participantService.rankingByLeagueId(leagueId);
    }

    @Transactional
    public Participant joinLeague(long leagueId, String accountName, String password) {
        League league = getLeagueByLeagueId(leagueId);
        if (!password.equals(league.getPassword())) {
            throw new InvalidLeaguePasswordException();
        }
        Account account = accountService.getAccountByName(accountName); // user is logged in, account is guaranteed to exist
        return participantService.addParticipant(new Participant(account, league));
    }

    // only the account behind a participant may remove it (= leave the league); the admin can never leave, only delete the league by calling deleteLeagueById
    public void removeParticipantById(long participantId, String accountName) {
        Participant participant = participantService.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException(Participant.class, participantId));
        if (!participant.isOwnedBy(accountName)) throw new NotResourceOwnerException(Participant.class, participantId, accountName);
        boolean isAdmin = accountName.equals(participant.getLeague().getAdmin().getName());
        if (isAdmin) throw new AdminCannotLeaveLeagueException();
        participantService.removeParticipant(participant);
    }

    // only the admin of a league may delete it
    public void deleteLeagueById(long leagueId, String accountName) {
        League league = getLeagueByLeagueId(leagueId); // 404 if the league doesn't exist
        boolean isAdmin = accountName.equals(league.getAdmin().getName());
        if (!isAdmin) throw new NotResourceOwnerException(League.class, leagueId, accountName);
        leagueRepository.delete(league);
    }
}

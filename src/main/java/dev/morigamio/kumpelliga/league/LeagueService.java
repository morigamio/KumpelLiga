package dev.morigamio.kumpelliga.league;

import dev.morigamio.kumpelliga.account.Account;
import dev.morigamio.kumpelliga.account.AccountRepository;
import dev.morigamio.kumpelliga.exception.InvalidLeaguePasswordException;
import dev.morigamio.kumpelliga.exception.LeagueAlreadyExistsException;
import dev.morigamio.kumpelliga.exception.ResourceAlreadyExistsException;
import dev.morigamio.kumpelliga.exception.ResourceNotFoundException;
import dev.morigamio.kumpelliga.participant.Participant;
import dev.morigamio.kumpelliga.participant.ParticipantRepository;
import dev.morigamio.kumpelliga.participant.Status;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeagueService {

    private final AccountRepository accountRepository;
    private final LeagueRepository leagueRepository;
    private final ParticipantRepository participantRepository;

    public LeagueService(LeagueRepository leagueRepository, AccountRepository accountRepository, ParticipantRepository participantRepository) {
        this.leagueRepository = leagueRepository;
        this.accountRepository = accountRepository;
        this.participantRepository = participantRepository;
    }

    public League createLeague(String name, String admin, String password) {
        Optional<Account> account = accountRepository.findByName(admin);
        boolean leagueExists = leagueRepository.findByName(name).isPresent();
        if (leagueExists) throw new LeagueAlreadyExistsException(name);
        League league = new League(name, password, account.get());
        return leagueRepository.save(league);
    }

    public List<League> getAllLeagues() {
        return leagueRepository.findAll();
    }

    public List<League> getLeaguesByName(String leagueName) {
        return leagueRepository.findByNameContainingIgnoreCase(leagueName);
    }

    public Optional<League> getLeagueByLeagueId(long leagueId) {
        return leagueRepository.findById(leagueId);
    }

    @Transactional
    public Participant joinLeague(long leagueId, String accountName, String password) {
        try {
            League league = leagueRepository.findById(leagueId).orElseThrow(() -> new ResourceNotFoundException(League.class, leagueId));
            if (!password.equals(league.getPassword())) {
                throw new InvalidLeaguePasswordException();
            }
            Account account = accountRepository.findByName(accountName).orElseThrow(); // throw is technically redundant, user is logged in, account is guaranteed to exist

            Participant participant = new Participant(account, league, Status.APPROVED);
            return participantRepository.saveAndFlush(participant);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceAlreadyExistsException(Participant.class, accountName);
        }
    }

    public void deleteLeagueById(Long leagueId) {
        leagueRepository.deleteById(leagueId);
    }
}

package dev.morigamio.kumpelliga.participant;

import dev.morigamio.kumpelliga.exception.NotResourceOwnerException;
import dev.morigamio.kumpelliga.exception.ResourceAlreadyExistsException;
import dev.morigamio.kumpelliga.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ParticipantService {
    private final ParticipantRepository participantRepository;

    public ParticipantService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    // an account can join a league only once (unique constraint on account + league)
    public Participant addParticipant(Participant participant) {
        try {
            return participantRepository.saveAndFlush(participant);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceAlreadyExistsException(Participant.class, participant.getName());
        }
    }

    public Optional<Participant> findByNameAndLeagueId(String name, long leagueId) {
        return participantRepository.findByNameAndLeagueId(name,leagueId);
    }

    public boolean existsByNameAndLeagueId(String name, long leagueId){
        return participantRepository.existsByNameAndLeagueId(name, leagueId);
    }

    public Optional<Participant> findById(long participantId) {
        return participantRepository.findById(participantId);
    }

    // only the account behind a participant may remove it (= leave the league)
    public void removeParticipantById(long participantId, String accountName) {
        Participant participant = findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException(Participant.class, participantId));
        if (!accountName.equals(participant.getAccount().getName())) {
            throw new NotResourceOwnerException(Participant.class, participantId, accountName);
        }
        participantRepository.delete(participant);
    }

    public List<Participant> rankingByLeagueId(long leagueId) {
        return participantRepository.findRankingByLeagueId(leagueId, Sort.by(Sort.Direction.DESC, "balance"));
    }
}

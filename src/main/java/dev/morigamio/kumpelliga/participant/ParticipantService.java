package dev.morigamio.kumpelliga.participant;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ParticipantService {
    private final ParticipantRepository participantRepository;

    public ParticipantService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    public Optional<Participant> findByNameAndLeagueId(String name, long leagueId) {
        return participantRepository.findByNameAndLeagueId(name,leagueId);
    }

    public void payOutWinnings(Participant participant, BigDecimal winnings) {
        participant.addPoints(winnings);
    }

    public Optional<Participant> findById(long id) {
        return participantRepository.findById(id);
    }

    public List<Participant> findByLeagueId(Long leagueId) {
        return participantRepository.findByLeagueId(leagueId);
    }

    public void removeParticipantById(long participantId) {
        participantRepository.deleteById(participantId);
    }

    public List<Participant> rankingByLeagueId(long leagueId) {
        return participantRepository.findRankingByLeagueId(leagueId, Sort.by(Sort.Direction.DESC, "balance"));
    }
}

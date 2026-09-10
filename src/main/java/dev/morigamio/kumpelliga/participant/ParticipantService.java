package dev.morigamio.kumpelliga.participant;

import lombok.extern.slf4j.Slf4j;
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

    public Optional<Participant> findByNameAndLeagueId(String name, long leagueId) {
        return participantRepository.findByNameAndLeagueId(name,leagueId);
    }

    public boolean existsByNameAndLeagueId(String name, long leagueId){
        return participantRepository.existsByNameAndLeagueId(name, leagueId);
    }

    public Optional<Participant> findById(long participantId) {
        return participantRepository.findById(participantId);
    }

    public void removeParticipantById(long participantId) {
        participantRepository.deleteById(participantId);
    }

    public List<Participant> rankingByLeagueId(long leagueId) {
        return participantRepository.findRankingByLeagueId(leagueId, Sort.by(Sort.Direction.DESC, "balance"));
    }
}

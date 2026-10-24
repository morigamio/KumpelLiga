package dev.morigamio.kumpelliga.game;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
class OddsPersistence {

    private final OddsRepository oddsRepository;

    OddsPersistence(OddsRepository oddsRepository) {
        this.oddsRepository = oddsRepository;
    }

    @Transactional
    public void storeOdds(List<Odds> odds) {
        for (Odds odd : odds) {
            oddsRepository.save(odd);
        }
    }

    public List<Odds> findAll(){
        return oddsRepository.findAll();
    }

    public Optional<Odds> findByGameId(Long gameId){
        return oddsRepository.findByGameId(gameId);
    }
}

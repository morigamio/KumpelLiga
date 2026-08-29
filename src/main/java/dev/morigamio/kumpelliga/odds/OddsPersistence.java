package dev.morigamio.kumpelliga.odds;

import dev.morigamio.kumpelliga.metadata.MetaData;
import dev.morigamio.kumpelliga.metadata.MetaDataConstants;
import dev.morigamio.kumpelliga.metadata.MetaDataRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class OddsPersistence {

    private final OddsRepository oddsRepository;
    private final MetaDataRepository metaDataRepository;

    public OddsPersistence(OddsRepository oddsRepository, MetaDataRepository metaDataRepository) {
        this.oddsRepository = oddsRepository;
        this.metaDataRepository = metaDataRepository;
    }

    @Transactional
    public void storeOdds(List<Odds> odds) {
        for (Odds odd : odds) {
            oddsRepository.save(odd);
        }
        MetaData timeStamp = new MetaData(MetaDataConstants.ODDS_DATA_TIMESTAMP, LocalDateTime.now().toString());
        metaDataRepository.save(timeStamp);
    }

    public List<Odds> findAll(){
        return oddsRepository.findAll();
    }

    public Optional<Odds> findByGameId(Long gameId){
        return oddsRepository.findByGameId(gameId);
    }
}

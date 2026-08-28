package dev.morigamio.kumpelliga.odds;

import dev.morigamio.kumpelliga.metadata.MetaData;
import dev.morigamio.kumpelliga.metadata.MetaDataConstants;
import dev.morigamio.kumpelliga.metadata.MetaDataRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class OddsPersistence {
    @Autowired
    private OddsRepository oddsRepository;

    @Autowired
    private MetaDataRepository metaDataRepository;

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

    public Optional<Odds> findById(Long id){
        return oddsRepository.findById(id);
    }
}

package dev.morigamio.kumpelliga.odds.spi;

import java.util.List;

public interface OddsDataClient {
    List<OddsData> retrieveOdds();
}

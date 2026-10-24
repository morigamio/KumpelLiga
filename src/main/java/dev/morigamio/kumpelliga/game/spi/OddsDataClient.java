package dev.morigamio.kumpelliga.game.spi;

import java.util.List;

public interface OddsDataClient {
    List<OddsData> retrieveOdds();
}

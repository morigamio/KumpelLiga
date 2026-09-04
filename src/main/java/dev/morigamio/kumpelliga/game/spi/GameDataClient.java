package dev.morigamio.kumpelliga.game.spi;

import java.time.LocalDateTime;
import java.util.List;

public interface GameDataClient {
    List<GameData> retrieveGameData();
    List<GameData> retrieveGameData(int gameDay);
    LocalDateTime retrieveUpdateTimeStamp(int gameDay);
}

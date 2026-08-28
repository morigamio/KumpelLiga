package dev.morigamio.kumpelliga.game.spi;

import java.util.List;

public interface GameDataClient {
    List<GameData> retrieveGameData();
}

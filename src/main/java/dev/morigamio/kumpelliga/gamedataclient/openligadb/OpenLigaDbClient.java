package dev.morigamio.kumpelliga.gamedataclient.openligadb;

import dev.morigamio.kumpelliga.game.spi.GameData;
import dev.morigamio.kumpelliga.game.spi.GameDataClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@ConditionalOnProperty(name = "gamedata.provider", havingValue = "openLigaDb")
public class OpenLigaDbClient implements GameDataClient {
    private static final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    private static final String GAME_DATA_URL = "https://api.openligadb.de/getmatchdata/bl1/2026";
    private static final String TIME_STAMP_URL = "https://api.openligadb.de/getlastchangedate/bl1/2026/%d";

    public List<GameData> retrieveGameData() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .GET()
                    .uri(URI.create(GAME_DATA_URL))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            List<OpenLigaDbEntry> entries = parseResponse(response);
            return toGameData(entries);

        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<GameData> retrieveGameData(int gameDay) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .GET()
                    .uri(URI.create(GAME_DATA_URL + "/" + gameDay))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            List<OpenLigaDbEntry> entries = parseResponse(response);
            return toGameData(entries);

        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("retrieveGameData", e);
        }
    }

    @Override
    public LocalDateTime retrieveUpdateTimeStamp(int gameDay) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .GET()
                    .uri(URI.create(TIME_STAMP_URL.formatted(gameDay)))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return LocalDateTime.parse(response.body().replace("\"", ""));
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("retrieveUpdateTimeStamp", e);
        }
    }

    private List<GameData> toGameData(List<OpenLigaDbEntry> entries) {
        List<GameData> gameData = new ArrayList<>();
        for (OpenLigaDbEntry entry : entries) {

            int [] currentScore = determineCurrentScore(entry.matchResults());

            gameData.add(new GameData(
                    entry.matchID(),
                    entry.matchDateTime(),
                    entry.team1().teamName(),
                    entry.team2().teamName(),
                    entry.matchIsFinished(),
                    entry.group().groupOrderId(),
                    currentScore[0],
                    currentScore[1]));
        }
        return gameData;
    }

    private int[] determineCurrentScore(MatchResult[] matchResults){
        int noPeriods = matchResults.length;

        if (noPeriods == 0){
            return new int[]{0,0};
        }
        int pointsTeam1 = matchResults[noPeriods-1].pointsTeam1();
        int pointsTeam2 = matchResults[noPeriods-1].pointsTeam2();
        return new int[]{pointsTeam1, pointsTeam2};
    }

    private List<OpenLigaDbEntry> parseResponse(HttpResponse<String> response) {
        ObjectMapper jsonMapper = new ObjectMapper();
        String body = response.body();
        return jsonMapper.readValue(body, new TypeReference<>() {
        });
    }
}

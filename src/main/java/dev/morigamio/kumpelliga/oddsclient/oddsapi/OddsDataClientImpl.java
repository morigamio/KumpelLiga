package dev.morigamio.kumpelliga.oddsclient.oddsapi;

import dev.morigamio.kumpelliga.odds.spi.OddsData;
import dev.morigamio.kumpelliga.odds.spi.OddsDataClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Component
@ConditionalOnProperty(name = "odds.provider", havingValue = "oddsApi")
public class OddsDataClientImpl implements OddsDataClient {

    private static final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    private static final String URL = "https://api.the-odds-api.com/v4/sports/soccer_germany_bundesliga/odds/?apiKey=%s&regions=eu&markets=h2h&oddsFormat=decimal";

    private final static Map<String, String> map = new HashMap<>();
    static {
        map.put("VfB Stuttgart","VfB Stuttgart");
        map.put("Bayern Munich","FC Bayern München");
        map.put("Borussia Monchengladbach","Borussia Mönchengladbach");
        map.put("RB Leipzig","RB Leipzig");
        map.put("SC Paderborn","SC Paderborn 07");
        map.put("FSV Mainz 05","1. FSV Mainz 05");
        map.put("Eintracht Frankfurt","Eintracht Frankfurt");
        map.put("Union Berlin","1. FC Union Berlin");
        map.put("TSG Hoffenheim","TSG Hoffenheim");
        map.put("1. FC Köln","1. FC Köln");
        map.put("Bayer Leverkusen","Bayer 04 Leverkusen");
        map.put("Elversberg","SV 07 Elversberg");
        map.put("Hamburger SV","Hamburger SV");
        map.put("Borussia Dortmund","Borussia Dortmund");
        map.put("Werder Bremen","SV Werder Bremen");
        map.put("SC Freiburg","SC Freiburg");
        map.put("FC Schalke 04","FC Schalke 04");
        map.put("Augsburg","FC Augsburg");
    }

    @Value("${api.key}")
    private String apiKey;

    public HttpResponse<String> retrieveOdds3(){
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .GET()
                    .uri(URI.create(URL.formatted(apiKey)))
                    .build();

            return client.send(request, HttpResponse.BodyHandlers.ofString());

        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<OddsData> retrieveOdds(){
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .GET()
                    .uri(URI.create(URL.formatted(apiKey)))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            List<OddsApiEntry> entries = parseResponse(response);
            return toGameOdds(entries);

        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    private List<OddsApiEntry> parseResponse(HttpResponse<String> response) {
        ObjectMapper jsonMapper = new ObjectMapper();
        String body = response.body();
        return jsonMapper.readValue(body, new TypeReference<>() {
        });
    }

    private List<OddsData> toGameOdds(List<OddsApiEntry> entries){
        List<OddsData> oddData = new ArrayList<>();
        for (OddsApiEntry entry : entries) {
            Odds avgOdds = avgOdds(entry);
            oddData.add(new OddsData(
                    map.get(entry.homeTeam()),
                    map.get(entry.awayTeam()),
                    avgOdds.home(),
                    avgOdds.away(),
                    avgOdds.draw(),
                    LocalDateTime.ofInstant(entry.matchTime(), ZoneId.of("Europe/Berlin"))));
        }
        return oddData;
    }

    private Odds avgOdds(OddsApiEntry oddsApiEntry) {

        String homeTeam = oddsApiEntry.homeTeam();
        String awayTeam = oddsApiEntry.awayTeam();

        Map<String, Double> oddsSum = new HashMap<>();
        oddsSum.put(homeTeam, 0.0);
        oddsSum.put(awayTeam, 0.0);
        oddsSum.put("Draw", 0.0);

        oddsApiEntry.bookmakers().forEach(
                bm -> bm.markets().getFirst().outcomes().forEach(
                        o -> {
                            String name = o.name();
                            double v = o.price();
                            oddsSum.computeIfPresent(name, (s, aDouble) -> aDouble + v);
                        }
                )
        );

        int noBookmakers = oddsApiEntry.bookmakers().size();

        return new Odds(
                Math.round(oddsSum.get(homeTeam) / noBookmakers * 100.0) / 100.0,
                Math.round(oddsSum.get(awayTeam) / noBookmakers * 100.0) / 100.0,
                Math.round(oddsSum.get("Draw") / noBookmakers * 100.0) / 100.0
        );
    }
}

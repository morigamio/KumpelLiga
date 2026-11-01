package dev.morigamio.kumpelliga.league;

// what strangers may see of a league (search before joining): no participants
record ReadLeagueSummaryDTO(long id, String name, String admin) {

    public static ReadLeagueSummaryDTO from(League league) {
        return new ReadLeagueSummaryDTO(
                league.getId(),
                league.getName(),
                league.getAdmin().getName()
        );
    }
}

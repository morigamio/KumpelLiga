package dev.morigamio.kumpelliga.league;

import java.util.List;

record ReadLeagueDTO(long id, String name, String admin, List<ReadParticipantDTO> participants){

    public static ReadLeagueDTO from(League league) {
        return new ReadLeagueDTO(
                league.getId(),
                league.getName(),
                league.getAdmin().getName(),
                ReadParticipantDTO.from(league.getParticipants())
        );
    }
}

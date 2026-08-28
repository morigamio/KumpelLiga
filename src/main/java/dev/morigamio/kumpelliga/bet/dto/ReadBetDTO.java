package dev.morigamio.kumpelliga.bet.dto;

import dev.morigamio.kumpelliga.bet.Bet;

public record ReadBetDTO(Long id, Long gameId, String prediction, float stake) {
    public static ReadBetDTO from(Bet bet){
        return new ReadBetDTO(
                bet.getId(),
                bet.getGame() != null ? bet.getGame().getId() : null,
                bet.getPrediction(),
                bet.getStake()
        );
    }
}

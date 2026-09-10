package dev.morigamio.kumpelliga.bet.dto;

import dev.morigamio.kumpelliga.bet.Bet;

import java.math.BigDecimal;

public record ReadBetDTO(Long id, String owner, Long gameId, String prediction, float stake, boolean isDouble, BigDecimal winnings) {
    public static ReadBetDTO from(Bet bet){
        return new ReadBetDTO(
                bet.getId(),
                bet.getParticipant().getName(),
                bet.getGame() != null ? bet.getGame().getId() : null,
                bet.getPrediction(),
                bet.getStake(),
                bet.isDouble(),
                bet.getWinnings()
        );
    }
}

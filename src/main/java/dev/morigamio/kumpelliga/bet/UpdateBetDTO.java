package dev.morigamio.kumpelliga.bet;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

record UpdateBetDTO(
        String prediction,
        @Positive BigDecimal stake
) {}

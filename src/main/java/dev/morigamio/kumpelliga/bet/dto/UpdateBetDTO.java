package dev.morigamio.kumpelliga.bet.dto;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record UpdateBetDTO(
        String prediction,
        @Positive BigDecimal stake
) {}

package dev.morigamio.kumpelliga.account.dto;

import dev.morigamio.kumpelliga.account.Account;

public record ReadAccountDTO(long id, String name) {

    public static ReadAccountDTO from(Account account) {
        return new ReadAccountDTO(
                account.getId(),
                account.getName());
    }
}

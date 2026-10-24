package dev.morigamio.kumpelliga.account;

record ReadAccountDTO(long id, String name) {

    public static ReadAccountDTO from(Account account) {
        return new ReadAccountDTO(
                account.getId(),
                account.getName());
    }
}

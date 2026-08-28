package dev.morigamio.kumpelliga.exception;

public class NotResourceOwnerException extends RuntimeException{
    public NotResourceOwnerException(Class<?> type, long id, String nowner) {
        super("%s with ID %d does not belong to owner %s".formatted(type.getSimpleName(),id, nowner));
    }
}

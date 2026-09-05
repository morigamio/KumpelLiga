package dev.morigamio.kumpelliga.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {


    // ---- 404 Not Found ----
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    // Missing static resource (e.g. the browser's automatic /favicon.ico request):
    // a normal 404, NOT a server error — handled explicitly so it doesn't fall into
    // the Exception catch-all below and get logged as an unexpected error.
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Void> handleNoStaticResource() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // ---- 403 Forbidden ----
    @ExceptionHandler(InvalidLeaguePasswordException.class)
    public ResponseEntity<Void> handleBadPassword() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @ExceptionHandler(NotParticipantException.class)
    public ResponseEntity<String> handleNotParticipant() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not a participant of this league");
    }

    @ExceptionHandler(NotResourceOwnerException.class)
    public ResponseEntity<Void> handleNotResourceOwner() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // ---- 401 Unauthorized ----
    @ExceptionHandler(PrincipalAccountNotFoundException.class)
    public ResponseEntity<Void> handlePrincipalAccountNotFound(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // Failed login / bad or missing credentials (e.g. BadCredentialsException from
    // authenticate()): an expected outcome, not a server error. Generic 401, no body,
    // so we don't reveal whether the username or the password was wrong.
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Void> handleAuthentication() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // ---- 409 Conflict ----
    @ExceptionHandler(BetAlreadyExistsException.class)
    public ResponseEntity<String> handleBetAlreadyExists() {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Bet already exists for this participant");
    }

    @ExceptionHandler(GameNotBettableException.class)
    public ResponseEntity<String> handleGameNotBettable() {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Game is not part of the current week's gameday.");
    }

    @ExceptionHandler(DoubleBetAlreadyUsedException.class)
    public ResponseEntity<String> handleDoubleBetAlreadyUsed() {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Double bet was already used by this participant for this gameday.");
    }

    @ExceptionHandler(LeagueAlreadyExistsException.class)
    public ResponseEntity<String> handleLeagueAlreadyExists(LeagueAlreadyExistsException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<String> handleResourceAlreadyExists(ResourceAlreadyExistsException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    // ---- 500 Unexpected: this is a REAL problem, log loudly with stack trace ----
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleUnexpected(Exception e) {
        log.error("Unexpected error", e); // full stack trace in logs
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong on our side, I am sorry ...");
    }
}

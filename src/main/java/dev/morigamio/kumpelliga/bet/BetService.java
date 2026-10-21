package dev.morigamio.kumpelliga.bet;

import dev.morigamio.kumpelliga.exception.*;
import dev.morigamio.kumpelliga.game.Game;
import dev.morigamio.kumpelliga.game.GameService;
import dev.morigamio.kumpelliga.participant.Participant;
import dev.morigamio.kumpelliga.participant.ParticipantService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BetService {

    private final ParticipantService participantService;
    private final BetRepository betRepository;
    private final GameService gameService;

    public BetService(ParticipantService participantService, BetRepository betRepository, GameService gameService) {
        this.participantService = participantService;
        this.betRepository = betRepository;
        this.gameService = gameService;
    }

    @Transactional
    public Bet registerBet(String leagueId, Long gameId, String name, String prediction) {
        // check if this user is a participant in that league
        Participant participant = participantService
                .findByNameAndLeagueId(name, Long.parseLong(leagueId))
                .orElseThrow(NotParticipantException::new);

        Game game = gameService.getGameById(gameId).orElseThrow(GameNotBettableException::new);

        // betting closes at kickoff
        if (game.hasStarted()) throw new GameHasStartedException();

        // check for a bet from this participant for this game
        boolean alreadyExists = betRepository.existsByParticipantIdAndGameId(participant.getId(), gameId);
        if (alreadyExists) throw new BetAlreadyExistsException();

        // store bet in db table
        Bet bet = new Bet(game, participant, prediction);
        betRepository.save(bet);
        return bet;
    }

    @Transactional
    public Bet updateBet(String name, Long betId, String prediction) {
        Bet bet = validateEditableBet(name, betId);

        // update bet according to new values
        bet.setPrediction(prediction);
        betRepository.save(bet);
        return bet;
    }

    @Transactional
    public List<Bet> updateBetToDouble(String name, Long betId) {
        Bet bet = validateEditableBet(name, betId);
        int gameDay = bet.getGame().getGameDay();
        Participant participant = bet.getParticipant();

        List<Bet> gameDayBets = betRepository.findByParticipantAndGame_GameDay(participant, gameDay);

        // was there a double bet for finished game already -> no double bet left for this gameday
        if (isDoubleAlreadyUsed(gameDayBets)) throw new DoubleBetAlreadyUsedException();

        gameDayBets.forEach(b -> b.setDouble(b.getId().equals(betId)));
        return gameDayBets;
    }

    @Transactional
    public List<Bet> updateBetToSingle(String name, Long betId) {
        Bet bet = validateBetOwner(name, betId);
        int gameDay = bet.getGame().getGameDay();
        Participant participant = bet.getParticipant();

        List<Bet> gameDayBets = betRepository.findByParticipantAndGame_GameDay(participant, gameDay);

        // if the double bet was already used, there is no modification possible for other bets, since it would mess with the logic for updating to doubles
        if (isDoubleAlreadyUsed(gameDayBets)) throw new DoubleBetAlreadyUsedException();

        gameDayBets.forEach(b -> b.setDouble(false));
        return gameDayBets;
    }

    @Transactional
    public void deleteBet(String name, Long betId) {
        Bet bet = validateEditableBet(name, betId);
        betRepository.delete(bet);
    }

    public Map<Long, List<Bet>> getUnpaidBetsByGameIds() {
        Map<Long, List<Bet>> unpaidBetsByGameId = new HashMap<>();
        List<Bet> bets = betRepository.findByIsPaidFalse();
        for (Bet bet : bets) {
            unpaidBetsByGameId.computeIfAbsent(bet.getGame().getId(), k -> new ArrayList<>()).add(bet);
        }
        return unpaidBetsByGameId;
    }

    // only the owner of a participant may see its bets, open ones included
    public List<Bet> getBetsByParticipantId(String name, long participantId) {
        Participant participant = participantService.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException(Participant.class, participantId));
        if (!name.equals(participant.getAccount().getName())) {
            throw new NotResourceOwnerException(Participant.class, participantId, name);
        }
        return betRepository.findByParticipantId(participantId);
    }

    // the participant name equals the account name, so the token alone tells us whose bets these are
    public List<Bet> getMyBetsByLeagueId(String name, long leagueId) {
        Participant participant = participantService.findByNameAndLeagueId(name, leagueId).orElseThrow(NotParticipantException::new);
        return betRepository.findByParticipantId(participant.getId());
    }

    private Bet validateBetOwner(String name, Long betId) {
        Bet bet = betRepository.findById(betId).orElseThrow(() -> new ResourceNotFoundException(Bet.class, betId));
        String betOwner = bet.getParticipant().getAccount().getName();
        if (!name.equals(betOwner)) {
            throw new NotResourceOwnerException(Bet.class, betId, name);
        }
        return bet;
    }

    // only the owner may change a bet, and only until the game kicks off
    private Bet validateEditableBet(String name, Long betId) {
        Bet bet = validateBetOwner(name, betId);
        if (bet.getGame().hasStarted()) throw new GameHasStartedException();
        return bet;
    }

    private boolean isDoubleAlreadyUsed(List<Bet> gameDayBets) {
        return gameDayBets.stream()
                .anyMatch(b -> b.isDouble() && b.getGame().hasStarted());
    }

    // settled bets of a league are visible to its members only
    public List<Bet> getPaidBetsByLeagueId(String name, long leagueId) {
        if (!participantService.existsByNameAndLeagueId(name, leagueId)) throw new NotParticipantException();
        return betRepository.findByParticipant_League_IdAndIsPaidTrue(leagueId);
    }
}

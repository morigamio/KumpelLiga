package dev.morigamio.kumpelliga.bet;

import dev.morigamio.kumpelliga.exception.*;
import dev.morigamio.kumpelliga.game.Game;
import dev.morigamio.kumpelliga.game.GameService;
import dev.morigamio.kumpelliga.participant.Participant;
import dev.morigamio.kumpelliga.participant.ParticipantService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

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

        // check for a bet from this participant for this game
        boolean alreadyExists = betRepository.existsByParticipantIdAndGameId(participant.getId(), gameId);
        if(alreadyExists) throw new BetAlreadyExistsException();

        // store bet in db table
        Bet bet = new Bet(game, participant, prediction);
        betRepository.save(bet);
        return bet;
    }

    @Transactional
    public Bet updateBet(String name, Long betId, String prediction) {
        Bet bet = validateBetOwner(name, betId);

        // update bet according to new values
        bet.setPrediction(prediction);
        betRepository.save(bet);
        return bet;
    }

    @Transactional
    public List<Bet> updateBetToDouble(String name, Long betId){
        Bet bet = validateBetOwner(name, betId);
        int gameDay = bet.getGame().getGameDay();
        Participant participant = bet.getParticipant();

        List<Bet> gameDayBets = betRepository.findByParticipantAndGameDay(participant, gameDay);
        gameDayBets.forEach(b -> b.setDouble(b.getId().equals(betId)));
        return gameDayBets;
    }

    @Transactional
    public List<Bet> updateBetToSingle(String name, Long betId){
        Bet bet = validateBetOwner(name, betId);
        int gameDay = bet.getGame().getGameDay();
        Participant participant = bet.getParticipant();

        List<Bet> gameDayBets = betRepository.findByParticipantAndGameDay(participant, gameDay);
        gameDayBets.forEach(b -> b.setDouble(false));
        return gameDayBets;
    }

    @Transactional
    public void deleteBet(String name, Long betId) {
        Bet bet = validateBetOwner(name, betId);
        betRepository.deleteById(bet.getId());
    }

    public Map<Long, List<Bet>> getUnpaidBetsByGameId() {
        Map<Long, List<Bet>> unpaidBetsByGameId = new HashMap<>();
        List<Bet> bets = betRepository.findByIsPaidFalse();
        for (Bet bet : bets) {
            unpaidBetsByGameId.computeIfAbsent(bet.getGame().getId(), k -> new ArrayList<>()).add(bet);
        }
        return unpaidBetsByGameId;
    }

    @Transactional
    public void setBetPaid(Bet bet) {
        bet.setPaid(true);
        betRepository.save(bet);
    }

    public List<Bet> getBetsByParticipant(Participant participant) {
        return betRepository.findByParticipantId(participant.getId());
    }

    private Bet validateBetOwner(String name, Long betId){
        Bet bet = betRepository.findById(betId).orElseThrow(() ->  new ResourceNotFoundException(Bet.class, betId));
        String betOwner = bet.getParticipant().getAccount().getName();
        if (!name.equals(betOwner)){
            throw new NotResourceOwnerException(Bet.class, betId, betOwner);
        }
        return bet;
    }
}

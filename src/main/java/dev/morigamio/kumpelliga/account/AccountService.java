package dev.morigamio.kumpelliga.account;

import dev.morigamio.kumpelliga.exception.ResourceAlreadyExistsException;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AccountService implements UserDetailsService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder encoder;

    public AccountService(AccountRepository accountRepository, PasswordEncoder encoder) {
        this.accountRepository = accountRepository;
        this.encoder = encoder;
    }

    public Account getAccountByName(String name) {
        return accountRepository.findByName(name).orElseThrow();
    }

    @Transactional
    public Account create(String name, String password) {
        try {
            Account account = new Account(null, name, encoder.encode(password));
            return accountRepository.saveAndFlush(account);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceAlreadyExistsException(Account.class, name);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByName(username).orElseThrow(() -> new UsernameNotFoundException("Invalid username or password"));
        return new User(account.getName(), account.getPassword(), Collections.emptyList());
    }
}

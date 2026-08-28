package dev.morigamio.kumpelliga.account;

import dev.morigamio.kumpelliga.account.dto.ReadAccountDTO;
import dev.morigamio.kumpelliga.account.dto.ChangeAccountDTO;
import dev.morigamio.kumpelliga.account.dto.CreateAccountDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/account")
    public ResponseEntity<ReadAccountDTO> getAccountDetails(Principal principal) {
        Account account = accountService.getAccountByName(principal.getName());
        return new ResponseEntity<>(ReadAccountDTO.from(account), HttpStatus.OK);
    }

    @PostMapping("/account")
    public ResponseEntity<ReadAccountDTO> registerUser(@RequestBody CreateAccountDTO user) {
        Account account = accountService.create(
                user.name(),
                user.password());
        return new ResponseEntity<>( ReadAccountDTO.from(account),HttpStatus.CREATED);
    }

    @PatchMapping("/account")
    public ReadAccountDTO changeAccountDetails(@RequestBody ChangeAccountDTO data, Principal principal) {
        return null; // implement later
    }

    @DeleteMapping("/account")
    public ReadAccountDTO delete(Principal principal) {
        return null;
    }
}

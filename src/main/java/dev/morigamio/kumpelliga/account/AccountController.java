package dev.morigamio.kumpelliga.account;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/account")
    ResponseEntity<ReadAccountDTO> getAccountDetails(Principal principal) {
        Account account = accountService.getAccountByName(principal.getName());
        return new ResponseEntity<>(ReadAccountDTO.from(account), HttpStatus.OK);
    }

    @PostMapping("/account")
    ResponseEntity<ReadAccountDTO> registerUser(@RequestBody CreateAccountDTO user) {
        Account account = accountService.create(
                user.name(),
                user.password());
        return new ResponseEntity<>( ReadAccountDTO.from(account),HttpStatus.CREATED);
    }

    @PatchMapping("/account")
    ReadAccountDTO changeAccountDetails(@RequestBody ChangeAccountDTO data, Principal principal) {
        return null; // implement later
    }

    @DeleteMapping("/account")
    ReadAccountDTO delete(Principal principal) {
        return null;
    }
}

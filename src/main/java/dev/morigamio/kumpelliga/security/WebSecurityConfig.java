package dev.morigamio.kumpelliga.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final AuthEntryPointJwt unauthorizedHandler;
    private final JwtAuthFilter jwtAuthFilter;

    WebSecurityConfig(AuthEntryPointJwt unauthorizedHandler, JwtAuthFilter jwtAuthFilter) {
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .exceptionHandling(e ->
                        e.authenticationEntryPoint(unauthorizedHandler)
                )
                .sessionManagement(s ->
                        s.sessionCreationPolicy(
                                org.springframework.security.config.http.SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(a ->
                        a.requestMatchers(HttpMethod.POST, "/account", "/session").permitAll())
                .authorizeHttpRequests(a ->
                        a.requestMatchers(HttpMethod.GET, "/", "/*.html", "/favicon.ico", "/css/**", "/js/**").permitAll())
                .authorizeHttpRequests(a ->
                        a.anyRequest().authenticated());

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

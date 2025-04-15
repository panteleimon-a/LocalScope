package com.vendingmachine.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Key;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        // Only skip JWT validation for GET /products and GET /products/{id}, and public user endpoints
        String path = request.getRequestURI();
        boolean isPublicProductsGet =
            ("GET".equals(request.getMethod()) &&
                (new AntPathRequestMatcher("/products", "GET").matches(request) ||
                 new AntPathRequestMatcher("/products/*", "GET").matches(request)));

        boolean isPublicUser =
            new AntPathRequestMatcher("/user/login").matches(request) ||
            (request.getMethod().equals("POST") && new AntPathRequestMatcher("/user").matches(request));

        if (isPublicProductsGet || isPublicUser) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        String token = null;
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            Claims claims = claimsJws.getBody();
            Map<String, Object> userMap = (Map<String, Object>) claims.get("user");

            if (userMap != null) {
                // Set the userMap as the principal
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userMap, null, Collections.emptyList());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"message\":\"Token expired\"}");
            return;
        } catch (JwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"message\":\"Invalid token\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}

    package com.example.ecolearn.utils;

    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.SignatureAlgorithm;
    import io.jsonwebtoken.security.Keys;
    import org.springframework.stereotype.Component;

    import java.security.Key;
    import java.util.Date;

    @Component
    public class JwtUtil {

        private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        private final long expiration = 1000 * 60 * 60 * 24; // 24 hours

        // Generate token with optional username/email/role
        public String generateToken(String username, String email, String role) {
            var builder = Jwts.builder()
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + expiration))
                    .signWith(key);

            if (username != null && !username.isEmpty()) {
                builder.setSubject(username);
            }

            if (email != null && !email.isEmpty()) {
                builder.claim("email", email);
            }

            if (role != null && !role.isEmpty()) {
                builder.claim("role", role); // store userType
            }

            return builder.compact();
        }

        public String getUsernameFromToken(String token) {
            var claims = Jwts.parserBuilder().setSigningKey(key).build()
                    .parseClaimsJws(token).getBody();
            return claims.getSubject();
        }

        public String getEmailFromToken(String token) {
            var claims = Jwts.parserBuilder().setSigningKey(key).build()
                    .parseClaimsJws(token).getBody();
            return claims.get("email", String.class); // may return null
        }

        public String getRoleFromToken(String token) {
            var claims = Jwts.parserBuilder().setSigningKey(key).build()
                    .parseClaimsJws(token).getBody();
            return claims.get("role", String.class); // may return null
        }

        public boolean validateToken(String token) {
            try {
                Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
    }

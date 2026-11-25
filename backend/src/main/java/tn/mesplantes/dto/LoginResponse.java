package tn.mesplantes.dto;

import java.time.Instant;
import java.util.List;

public record LoginResponse(String accessToken, String tokenType, Instant expiresAt,
                            String username, List<String> roles) {
}
